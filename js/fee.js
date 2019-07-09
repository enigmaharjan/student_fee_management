window.onload = function () {
    const edit_fee = document.getElementById('edit_fee');
    const select = document.getElementById('select_batch');
    const selectFeeType = document.getElementById('select_fee_type');
    const feeTitle = document.getElementById('fee_title');
    const fee_table = document.getElementById('fee_table');
    const searchButton = document.getElementById('searchForFeeBtn');
    const deleteButton = document.getElementById('delete_btn');


    searchButton.addEventListener('click', onClick)
    edit_fee.addEventListener('click', editFee)
    deleteButton.addEventListener('click', deleteFee)


    const url = "http://localhost:3000/"
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

    async function onClick(event) {
        let txt = '';
        txt += '<tr>'
        txt += '<td>' + "No data" + '</td>';
        txt += '<td>' + "No data" + '</td>';
        txt += '<td>' + "No data" + '</td>';
        txt += '<td>' + "No data" + '</td>';
        txt += '<td>' + "No data" + '</td>';
        txt += '<td></td>';
        txt += '<td></td>';
        txt += '</tr>';
        fee_table.innerHTML = txt;
        try {
            const val = select.selectedIndex;
            const batch = select.options[val].innerText;

            const feeVal = selectFeeType.selectedIndex;
            const feeValue = selectFeeType.options[feeVal].innerText;
            let feeStat = 3;
            if (feeValue === "Due") {
                feeStat = 1;
                feeTitle.innerHTML = "Due Fee"
            }
            else {
                feeStat = 0;
                feeTitle.innerHTML = "Paid Fee"
            }
            console.log(feeStat)

            // console.log(batch)
            const feeRes = await fetch(url + 'api/fee/' + batch + '/' + feeStat);
            const feeData = await feeRes.json();
            console.log(feeData)
            txt = '';
            if (feeStat == 1) {
                for (let x = 0; x < feeData.length; x++) {
                    txt += '<tr>'
                    txt += '<td>' + Number(x + 1) + '</td>';
                    const feeStudent = await fetch(url + 'api/students/' + feeData[x].student_id)
                    const feeStudentRes = await feeStudent.json();
                    txt += '<td>' + feeStudentRes[0].student_name + '</td>';
                    txt += '<td>' + feeData[x].amount + '</td>';
                    txt += '<td>' + feeData[x].fee_date + '</td>';
                    txt += '<td>' + feeData[x].due_date + '</td>';
                    txt += '<td><div style = "width:2px; word-wrap: break-word"><a class="btn btn-success " ';
                    txt += 'data-value="' + feeData[x].id + '" ';
                    txt += 'data-toggle="modal" data-target="#addFeeModal" onclick ="editFee(' + feeData[x].id + ')">';
                    txt += '<i class="fa fa-pencil"></i>';
                    txt += '</a></div></td>';
                    txt += '<td></td>';
                    txt += '</tr>';
                    fee_table.innerHTML = txt;
                }
            }
            else {
                for (let x = 0; x < feeData.length; x++) {
                    txt += '<tr>'
                    txt += '<td>' + Number(x + 1) + '</td>';
                    const feeStudent = await fetch(url + 'api/students/' + feeData[x].student_id)
                    const feeStudentRes = await feeStudent.json();
                    txt += '<td>' + feeStudentRes[0].student_name + '</td>';
                    txt += '<td>' + feeData[x].amount + '</td>';
                    txt += '<td>' + feeData[x].fee_date + '</td>';
                    txt += '<td>' + feeData[x].due_date + '</td>';
                    txt += '<td></td>';
                    txt += '<td></td>';
                    txt += '</tr>';
                    fee_table.innerHTML = txt;
                }
            }
        }
        catch (err) {
            alert(err)
        }

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
    //for adding fee

    async function editFee(event) {
        if(amount.value ==''){
            alert('Insert Amount')
        }
        else{
        // these nodes are all declared in the fee.ejs file. So don't need to be re-declared due to its const nature
        const date_fee = showdate(feeDate.value);
        const date_due = showdate(dueDate.value);
        const batch = document.getElementById('edit_fee').value;
        const studentId = fee_student_name.value;
        const newAmount = amount.value;
        const feeId = closeBtn.value;
        console.log("Student id is: " + studentId);

        console.log("I'm here")
        const prevData = await fetch(url + 'api/fee/' + feeId);
        const prevRes = await prevData.json();
        console.log(prevRes)
        if (prevRes[0].amount == newAmount) {
            const putFee = await fetch(url + "api/fee/" + feeId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    batch: batch,
                    student_id: studentId,
                    amount: newAmount,
                    fee_date: date_fee,
                    due_date: date_due,
                    cleared: 't'

                })
            })
            const putRes = await putFee.json();
            if (putRes.data === 'success') {
                alert('Full Payment Done')
                window.location.href = '/fee'
            }
            else {
                alert('Something is wrong!!')
            }
        }
        else {
            const editAmount = prevRes[0].amount - newAmount;
            const paidFee = await fetch(url + 'api/fee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    batch: batch,
                    student_id: studentId,
                    amount: editAmount,
                    fee_date: date_fee,
                    due_date: date_due,
                    amount: newAmount,
                    cleared: 't'

                })
            })
            const paidFeeRes = await paidFee;
            console.log(paidFeeRes);
            const putFee = await fetch(url + "api/fee/" + feeId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    batch: batch,
                    student_id: studentId,
                    amount: editAmount,
                    fee_date: date_fee,
                    due_date: date_due,
                    cleared: 'f'

                })
            })
            const putRes = await putFee.json();
            console.log(putRes);
            if (putRes.data === 'success') {
                alert('Partial Payment Done')
                window.location.href = '/fee'
            }
            else {
                alert('Something is wrong!!')
            }
        }
    }
    }

    async function deleteFee(event) {
        let fee_id = closeBtn.value;
        if (confirm('Are you sure?')) {
            try {
                const deleteData = await fetch(url + 'api/fee/delete/' + fee_id, {
                    method: 'delete'
                })
                const deleteRes = await deleteData.json();
                console.log(deleteRes)
                if(deleteRes.status === 'true'){
                    alert("Deleted Fee")
                    window.location.href = '/fee'
                    }
                    else{
                        alert("Couldn't Delete.\nPlease see console log")
                        console.log(deleteRes)
                    }
            }
            catch (err) {
                alert(err)
            }
        }
    }

}