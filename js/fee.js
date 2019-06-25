window.onload = function () {
    const amount = document.getElementById('fee_amount').value;
      const feeDate1 = document.getElementById('fee_date');
      const feeDate = feeDate1.value;
      const dueDate1 = document.getElementById('due_date');
      const dueDate = dueDate1.value;
      const select = document.getElementById('select_batch');
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
          .catch(err =>{
              console.log(err);
              alert(err)
          })

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
          const forDate =  month  + " " + dateArr[2] + ", " + dateArr[0];
          return forDate;
      }
      //for adding fee

      function submitFee(event) {
          const date_fee = showdate(feeDate);
          alert(date_fee)
          alert(feeDate)
          const date_due = showdate(dueDate);
          const val = select.selectedIndex;
          const batch = select.options[val].innerText;
          const studentId = student_id.selectedIndex;
          const id_student = student_id.options[studentId].innerText;

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
                  window.location.href= '/index';
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

      

  }