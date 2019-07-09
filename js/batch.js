window.onload = async function () {
    try {
        const url = "http://localhost:3000/";

        const editName = document.getElementById('edit_batch_name');
        editName.addEventListener('click', editBatchName)
        // editBatch.addEventListener('click', editBatchName)
        const headers = {
            "authorization": localStorage.getItem('Token')
        }

        const batch_table = document.getElementById("batch_table");

        try {
            const batch = await fetch(url + 'api/batch', { headers: headers })
            const batchRes = await batch.json();

            if (batchRes.name === "JsonWebTokenError") {
                alert("You are not authorized.\nPlease Login First")
                window.location.href = '/login';
            }
            else {
                let txt = '';
                for (let x = 0; x < batchRes.length; x++) {
                    txt += '<tr>';
                    txt += '<td>' + Number(x+1) + '</td>';
                    txt += '<td>' + batchRes[x].batch_name + '</td>';
                    txt += '<td><div style = "width:2px; word-wrap: break-word"><a class="btn btn-success " ';
                    txt += 'data-value="' + batchRes[x].id + '" ';
                    txt += 'data-toggle="modal" data-target="#addClassModal" onclick ="editBatch(' + batchRes[x].id + ')">';
                    txt += '<i class="fa fa-pencil"></i>';
                    txt += '</a></div></td>';
                    txt += '<td><div style = "width:2px; word-wrap: break-word"><a class="btn btn-success " ';
                    txt += 'data-value="' + batchRes[x].id + '" ';
                    txt += 'data-toggle="modal" onclick ="deleteBatch(' + batchRes[x].id + ')">';
                    txt += '<i class="fa fa-trash"></i>';
                    txt += '</a></div></td>';
                    txt += '</tr>';
                    batch_table.innerHTML = txt;
                }
            }
        }
        catch (err) {
            alert(err)
        }

        
        async function editBatchName() {
          // if(edit_batch.value == ''){
          //   alert('I expect a batch name');
          // }
          // else{
            const newBatch = edit_batch.value;
            console.log(batch_id) //batch_id is set in batch.ejs page and hence is taken in this page
            try {
              const editData = await fetch(url + 'api/batch/update/' + batch_id, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  batch_name : newBatch
                })
              })
              const editRes = await editData.json();
              console.log(editRes);
              if(editRes.data === 'success'){
                  alert('Batch Edited Successfully')
                  window.location.href = '/batch'
              }
              else{
                alert('Batch Not Edited')
                window.location.href = '/batch'
              }
            }
            catch (err) {
              alert(err)
            }
          }
        // }
    }
    catch (err) {
        alert(err)
    }
}