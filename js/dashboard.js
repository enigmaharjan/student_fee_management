window.onload = function () {
    const select = document.getElementById('select_batch');

    const url = "http://localhost:3000/"

    const modal_add_fee = document.getElementById('add_fee_modal');
    const modal_add_student = document.getElementById('add_student_modal');

    //adding click event in the anchor tag i.e. 'a'
    if (typeof window.addEventListener != "undefined") {
        modal_add_fee.addEventListener("click", getBatchForFee, false);
        modal_add_student.addEventListener("click", getBatchForStudent, false);
        console.log('hello')
    } else {
        modal_add_fee.attachEvent("onclick", getBatch);
    }

    function getBatchForFee(event) {
        console.log('getting the batch for adding fee')
        fetch(url + 'api/batch', {
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
                const list = document.getElementById('list');
                for (let i = 0; i < json.length; i++) {
                    const option = document.createElement('OPTION'),
                        txt = document.createTextNode(json[i].batch_name);
                    option.appendChild(txt);
                    option.setAttribute("value", json[i]);
                    select.insertBefore(option, select.lastChild);
                }
            })
            .catch(err => {
                console.log(err);
                alert(err)
            })
        return false;
    }

    function onClick(event) {
        const val = select.selectedIndex;
        const batch = select.options[val].innerText;

        // console.log(batch)
        fetch(url + 'api/students/batch/' + batch)
            .then(data => {
                return data.json()
            })
            .then(json => {
                const select_student = document.getElementById('select_student_fee');
                select_student.options.length = null;  //to clear the elements in drop down menu.
                for (let i = 0; i < json.length; i++) {
                    const option = document.createElement('OPTION'),
                        txt = document.createTextNode(json[i].student_id);
                    option.appendChild(txt);
                    option.setAttribute("value", json[i]);
                    select_student.insertBefore(option, select_student.firstChild);
                }

            })
            .catch(error => {
                console.log(error)
                alert(error)
            })
    }



    //for adding fee

    function submitFee(event) {
        let amount = document.getElementById('fee_amount').value;
        let feeDate1 = document.getElementById('fee_date');
        let feeDate = feeDate1.value;
        let dueDate1 = document.getElementById('due_date');
        let dueDate = dueDate1.value;
        let date_fee = showdate(feeDate);
        alert(date_fee)
        alert(feeDate)
        let date_due = showdate(dueDate);
        let val = select.selectedIndex;
        let batch = select.options[val].innerText;
        let studentId = student_id.selectedIndex;
        let id_student = student_id.options[studentId].innerText;
        alert("Did you fetch??")
        console.log("I'm here")
        fetch(url + "api/fee", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                batch: batch,
                student_id: id_student,
                amount: amount,
                fee_date: date_fee,
                due_date: date_due,
                cleared: 'f'

            })
        })
            .then(data => {
                return data.json;
            })
            .then(json => {
                console.log(json)
                window.location.href = '/index';
            })
            .catch(err => {
                console.log(err)
            })

    }


    //   getBatchBtn.addEventListener('click', getBatch);
    const addFeeBtn = document.getElementById('submit_fee');
    const student_id = document.getElementById('select_student_fee');
    addFeeBtn.addEventListener('click', submitFee)
    const searchButton = document.getElementById('search');
    searchButton.addEventListener('click', onClick)


    const select_student = document.getElementById('add_student_batch');
    const submitBtn = document.getElementById('add_student_submit');

    submitBtn.addEventListener('click', addStudents);

    function getBatchForStudent(event) {
        console.log("Getting batch for adding students")
        fetch(url + 'api/batch', {
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
    }
    function addStudents(event) {
        const student_name = document.getElementById('add_student_name').value;
        const student_id = document.getElementById('add_student_id').value;
        const contact = document.getElementById('add_student_contact_number').value;
        const address = document.getElementById('add_student_address').value;
        const email = document.getElementById('add_student_email').value;
        const guardian_name = document.getElementById('add_student_guardian_name').value;
        const guardian_contact = document.getElementById('add_student_guardian_contact').value;
        const dob = document.getElementById('add_student_date_of_birth').value;
        const djoined = document.getElementById('add_student_date_joined').value;

        const val = select.selectedIndex;
        const batch = select.options[val].innerText;
        const date_of_birth = showdate(dob);
        const date_joined = showdate(djoined);

        fetch(url_student + 'api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                student_id: student_id,
                batch: batch,
                student_name: student_name,
                address: address,
                email: email,
                contact_number: contact,
                guardian_name: guardian_name,
                guardian_contact: guardian_contact,
                date_of_birth: date_of_birth,
                date_joined: date_joined,
                image_name: 'null'
            })
        })
            .then(data => {
                return JSON.stringify(data);
            })
            .then(json => {
                console.log(json);
                alert("You successfully registered.");
                window.location.href = '/index'
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

    const addBatch = document.getElementById('submit_batch_name');
    addBatch.addEventListener('click', addBatchName);

    function addBatchName(event) {
        let batch_name = document.getElementById('add_batch_name').value;
        fetch(url + 'api/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                batch_name: batch_name
            })
        })
            .then(data => {
                return JSON.stringify(data);
            })
            .then(json => {
                alert("Batch added");
                window.location.href = '/index'
                return json
            })
            .catch(err => {
                alert(err);
                console.log(err);
                window.location.href = '/index'
            })
    }


}