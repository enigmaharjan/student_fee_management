window.onload = async function () {
    try {
        const url = "http://localhost:3000/";

        const select_student = document.getElementById('select_batch');
        const searchBtn = document.getElementById('btnSearchStudent');
        const student_table = document.getElementById('student_table');
        const edit_student_submit = document.getElementById('edit_student_submit');
        const select = document.getElementById('add_student_batch');

        //setting DOM from modal to variables
        const student_nameDOM = document.getElementById('add_student_name');
        const student_idDOM = document.getElementById('add_student_id');
        const contactDOM = document.getElementById('add_student_contact_number');
        const addressDOM = document.getElementById('add_student_address');
        const emailDOM = document.getElementById('add_student_email');
        const guardian_nameDOM = document.getElementById('add_student_guardian_name');
        const guardian_contactDOM = document.getElementById('add_student_guardian_contact');
        const dobDOM = document.getElementById('add_student_date_of_birth');
        const djoinedDOM = document.getElementById('add_student_date_joined');
        const deleteStudent = document.getElementById('delete_student');

        //setting event listener on DOM
        searchBtn.addEventListener('click', viewStudent);
        edit_student_submit.addEventListener('click', editStudent);
        deleteStudent.addEventListener('click', delete_Student)

        //setting the JWT in variable
        const headers = {
            "authorization": localStorage.getItem('Token')
        }

        try {
            const batch = await fetch(url + 'api/batch', { headers: headers })
            const batchRes = await batch.json();

            if (batchRes.name === "JsonWebTokenError") {
                alert("You are not authorized.\nPlease Login First")
                window.location.href = '/login';
            }
            else {
                for (let i = 0; i < batchRes.length; i++) {
                    const option = document.createElement('OPTION'),
                        txt = document.createTextNode(batchRes[i].batch_name);
                    option.appendChild(txt);
                    option.setAttribute("value", batchRes[i]);
                    select_student.insertBefore(option, select_student.lastChild);
                }
            }
        }
        catch (err) {
            alert(err)
        }

        async function viewStudent(event) { 
            let txt = '';
            txt += '<tr>'
        txt += '<td>' + "No data" +'</td>';
        txt += '<td>' + "No data" + '</td>';
        txt += '<td>' +  "No data" +'</td>';
        txt += '<td>' +  "No data" +'</td>';
        txt += '<td></td>';
        txt += '</tr>';
        student_table.innerHTML = txt;
            try {
                const val = select_student.selectedIndex;
                const batch = select_student.options[val].innerText;
                const studentData = await fetch(url + 'api/students/batch/' + batch);
                const studentRes = await studentData.json();

                let txt = '';
                for (let x = 0; x < studentRes.length; x++) {
                    txt += '<tr>'
                    txt += '<td>' + studentRes[x].student_id + '</td>';
                    txt += '<td>' + studentRes[x].student_name + '</td>';
                    txt += '<td>' + studentRes[x].address + '</td>';
                    txt += '<td>' + studentRes[x].contact_number + '</td>';
                    txt += '<td><a class="btn btn-primary btn-block" ';
                    txt += 'data-value="' + studentRes[x].student_id + '" ';
                    txt += 'data-toggle="modal" data-target="#addPostModal" class="btn btn-secondary" onclick ="editStudent_student(' + studentRes[x].student_id + ')">';
                    txt += '<i class="fa fa-angle-double-right"></i> Details';
                    txt += '</a></td>';
                    txt += '</tr>';
                    student_table.innerHTML = txt;
                }
            }
            catch (err) {
                alert(err)
            }
        }

        
        function editStudent(event) {
            // if(student_nameDOM.value || contactDOM.value || addressDOM.value || emailDOM.value || guardian_contactDOM.value || guardian_nameDOM.value == '')
            const student_name = student_nameDOM.value;
            const student_id = student_idDOM.value;
            const contact = contactDOM.value;
            const address = addressDOM.value;
            const email = emailDOM.value;
            const guardian_name = guardian_nameDOM.value;
            const guardian_contact = guardian_contactDOM.value;
            const dob = dobDOM.value;
            const djoined = djoinedDOM.value;

            const val = select.selectedIndex;
            const batch = select.options[val].innerText;
            const date_of_birth = showdate(dob);
            const date_joined = showdate(djoined);

            fetch(url + 'api/students/' + student_id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    batch: batch,
                    student_name: student_name,
                    address: address,
                    email: email,
                    contact_number: contact,
                    guardian_name: guardian_name,
                    guardian_contact: guardian_contact,
                    date_of_birth: date_of_birth,
                    date_joined: date_joined
                })
            })
                .then(data => {
                    return JSON.stringify(data);
                })
                .then(json => {
                    console.log(json);
                    alert("You successfully edited.");
                    window.location.href = '/student'
                })
                .catch(err => {
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

        async function delete_Student(event){
            let student_id = student_idDOM.value;
            if (confirm('Are you sure?')) {
                try{
                const result = await fetch(url + 'api/students/delete/'+student_id,{
                    method:'delete'
                  })
                  const resData = await result.json();
                  if(resData.status === 'true'){
                  alert("Deleted Student")
                  window.location.href = '/student'
                  }
                  else{
                      alert("Couldn't Delete.\nPlease see console log")
                      console.log(resData)
                  }
                }
                catch(err){
                    alert(err)
                }
              }

        }
    }
    catch (err) {
        alert(err)
    }
}