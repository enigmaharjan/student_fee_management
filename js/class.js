window.onload = function(){
    const url_class = "http://localhost:3000/";
    const addBatch = document.getElementById('submit_batch_name');
    addBatch.addEventListener('click', addBatchName);

    function addBatchName(event){
    let batch_name = document.getElementById('add_batch_name').value;
        fetch(url_class + 'api/batch',{
            method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      batch_name : batch_name
                  })
                })
                  .then(data=>{
                      return JSON.stringify(data);
                  })
                  .then(json=>{
                      alert("Batch added");
                      window.location.href = '/index'
                      return json
                  })
                  .catch(err=>{
                      alert(err);
                      console.log(err);
                      window.location.href = '/index'
                  })
        }
    

}