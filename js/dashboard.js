window.onload = async function () {
    //setting up the url
    const url = "http://localhost:3000/";

    const select = document.getElementById('select_batch');

    //getting id for modal
    const modal_add_fee = document.getElementById('add_fee_modal');
    const modal_add_student = document.getElementById('add_student_modal');

    //adding click event in the anchor tag i.e. 'a'
    if (typeof window.addEventListener != "undefined") {
        modal_add_fee.addEventListener("click", getBatchForFee, false);
        modal_add_student.addEventListener("click", getBatchForStudent, false);
    } else {
        modal_add_fee.attachEvent("onclick", getBatchForFee);
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
                    window.location.href = '/login';
                }
                const list = document.getElementById('list');
                if (json.length > 0) {
                    for (let i = 0; i < json.length; i++) {
                        const option = document.createElement('OPTION'),
                            txt = document.createTextNode(json[i].batch_name);
                        option.appendChild(txt);
                        option.setAttribute("value", json[i]);
                        select.insertBefore(option, select.lastChild);
                    }
                }
                else {
                    const option = document.createElement('OPTION'),
                        txt = "You don't have any class added yet";
                    option.appendChild(txt);
                    option.setAttribute("value", 0);
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
                if (json.length > 0) {
                    for (let i = 0; i < json.length; i++) {
                        const option = document.createElement('OPTION'),
                            txt = document.createTextNode(json[i].student_id);
                        option.appendChild(txt);
                        option.setAttribute("value", json[i]);
                        select_student.insertBefore(option, select_student.firstChild);
                    }
                }
                else {
                    const option = document.createElement('OPTION'),
                        txt = document.createTextNode("No students are in this batch.");
                    option.appendChild(txt);
                    option.setAttribute("value", 0);
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
        let date_due = showdate(dueDate);
        let val = select.selectedIndex;
        let batch = select.options[val].innerText;
        let studentId = student_id.selectedIndex;
        let id_student = student_id.options[studentId].innerText;
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
                alert("Fee Added.")
                window.location.href = '/';
            })
            .catch(err => {
                console.log(err)
            })

    }
    const addFeeBtn = document.getElementById('submit_fee');
    const student_id = document.getElementById('select_student_fee');
    addFeeBtn.addEventListener('click', submitFee)
    const searchButton = document.getElementById('search');
    searchButton.addEventListener('click', onClick)


    //js scripts for adding students
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
                    window.location.href = '/login';
                }
                for (let i = 0; i < json.length; i++) {
                    const option_student = document.createElement('OPTION'),
                        txt = document.createTextNode(json[i].batch_name);
                    option_student.appendChild(txt);
                    option_student.setAttribute("value", json[i]);
                    select_student.insertBefore(option_student, select_student.lastChild);
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

        const val = select_student.selectedIndex;
        const batch = select_student.options[val].innerText;
        const date_of_birth = showdate(dob);
        const date_joined = showdate(djoined);

        fetch(url + 'api/students', {
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
                window.location.href = '/'
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

    //js script for adding batch
    const addBatch = document.getElementById('submit_batch_name');
    addBatch.addEventListener('click', addBatchName);

    function addBatchName(event) {
            let batch_name = document.getElementById('add_batch_name').value;
            fetch(url + 'api/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": localStorage.getItem('Token')
                },
                body: JSON.stringify({
                    batch_name: batch_name
                })
            })
                .then(data => {
                    return JSON.stringify(data);
                })
                .then(json => {
                    if (json.name === "JsonWebTokenError") {
                        alert("You are not authorized.\nPlease Login First")
                        window.location.href = '/login';
                    }
                    else{
                    alert("Batch added");
                    window.location.href = '/'
                    return json
                    }
                })
                .catch(err => {
                    alert(err);
                    console.log(err);
                })
        
    }

    //Getting the side pane element 
    const fee_sidePane = document.getElementById('fee_sidePane');
    const batch_sidePane = document.getElementById('batch_sidePane');
    const student_sidePane = document.getElementById('student_sidePane');
    const student_table = document.getElementById('student_details');

    fee_sidePane.innerText = "---"
    batch_sidePane.innerText = "---"
    student_sidePane.innerText = "---"

    let txt = '';
    txt += '<tr>'
    txt += '<td>No data</td>';
    txt += '<td>No data</td>';
    txt += '<td>No data</td>';
    txt += '<td>No data</td>';
    txt += '<td></td>';
    txt += '</tr>';
    student_table.innerHTML = txt;
    try {
        //For side pane
        const header = {
            "authorization": localStorage.getItem('Token')
        }

        const allResponse = await Promise.all([
            fetch(url + "api/students", { headers: header }),
            fetch(url + "api/batch", { headers: header }),
            fetch(url + "api/fee", { headers: header }),
        ])

        const feeRes = await allResponse[2].json();
        const batchRes = await allResponse[1].json();
        const studentRes = await allResponse[0].json();

        //Checking JSON data
        if (studentRes.name === "JsonWebTokenError") {
            alert("You are not authorized.\nPlease Login First")
            window.location.href = '/login';
        }


        //showing number of batch 
        batch_sidePane.innerText = batchRes.length

        //showing number of students
        student_sidePane.innerText = studentRes.length

        //showing unpaid amount to sidepane
        let unPaidAmount = 0;
        for (let amountCleared = 0; amountCleared < feeRes.length; amountCleared++) {

            if (!feeRes[amountCleared].cleared) {
                unPaidAmount = Number(feeRes[amountCleared].amount) + unPaidAmount;
            }
        }
        fee_sidePane.innerText = unPaidAmount

        //For showing student details in table
        let txt = '';
        for (let x = 0; x < studentRes.length; x++) {
            txt += '<tr>'
            txt += '<td>' + Number(x + 1) + '</td>';
            txt += '<td>' + studentRes[x].student_name + '</td>';
            txt += '<td>' + studentRes[x].batch + '</td>';
            txt += '<td>' + studentRes[x].contact_number + '</td>';
            txt += '<td></td>';
            txt += '</tr>';
            student_table.innerHTML = txt;
        }
    }
    catch (err) {
        alert(err)
    }
}