window.onload = function () {
    const url_student = "http://localhost:3000/";

    const select_student = document.getElementById('add_student_batch');
    const submitBtn= document.getElementById('add_student_submit');

    submitBtn.addEventListener('click', addStudents);


    fetch(url_student + 'api/batch', {
        headers: {
            "authorization": localStorage.getItem('Token')
        }
    })
        .then(data => {
            return data.json()
        })
        .then(json => {
            if (json.name === "JsonWebTokenError") {
                alert("You are not authorized.\nPlease Login First")
                window.location.href = '/';
            }
            for (let i = 0; i < json.length; i++) {
                const option = document.createElement('OPTION'),
                    txt = document.createTextNode(json[i].batch_name);
                option.appendChild(txt);
                option.setAttribute("value", json[i]);
                select_student.insertBefore(option, select_student.lastChild);
            }
        })
        .catch(err => {
            console.log(err);
            alert(err)
        })

        function addStudents(event){
            const student_name = document.getElementById('add_student_name').value;
            const student_id = document.getElementById('add_student_id').value;
            const contact = document.getElementById('add_student_contact_number').value;
            const address = document.getElementById('add_student_address').value;
            const email = document.getElementById('add_student_email').value;
            const guardian_name = document.getElementById('add_student_guardian_name').value;
            const guardian_contact = document.getElementById('add_student_guardian_contact').value;
            const dob= document.getElementById('add_student_date_of_birth').value;
            const djoined= document.getElementById('add_student_date_joined').value;
            
            const val = select.selectedIndex;
            const batch = select.options[val].innerText;
            const date_of_birth = showdate(dob);
            const date_joined = showdate(djoined);

            fetch(url_student + 'api/student',{
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      student_id:student_id,
                      batch: batch,
                      student_name: student_name,
                      address: address,
                      email:email,
                      contact_number:contact,
                      guardian_name:guardian_name,
                      guardian_contact:guardian_contact,
                      date_of_birth:date_of_birth,
                      date_joined:date_joined
            })
        })
        .then(data=>{
            return JSON.stringify(data);
        })
        .then(json=>{
            console.log(json);
            alert("You successfully registered.");
        })
        .catch(err=>{
            alert(err);
        })
    }
    //function for converting month to month name
    function showdate(date) {
        const dateString = date;

        var months = new Array();
        months[0] = "Jan";
        months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
        months[7] = "Aug";
        months[8] = "Sep";
        months[9] = "Oct";
        months[10] = "Nov";
        months[11] = "Dec";

        const newdate = new Date(dateString);
        const month = months[newdate.getMonth()];
        //converting the date into array
        const dateArr = dateString.split("-");
        //setting up the new date form
        const forDate = month + " " + dateArr[2] + ", " + dateArr[0];
        return forDate;
    }
}