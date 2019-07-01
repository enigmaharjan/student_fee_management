
window.onload = function () {
    const loginbtn = document.getElementById('btnLogin');
    loginbtn.addEventListener('click', function () {
        const userNameNode = document.getElementById('username');
        const passWordNode = document.getElementById('password');
        const username = userNameNode.value;
        const password = passWordNode.value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(data => {
                return data.json();
            })
            .then(json => {
                if (json.success === 'true') {
                    localStorage.setItem('Token', json.accessToken);
                    localStorage.setItem('username', username)
                    alert(json.accessToken);
                    window.location.href = '/'
                }
                else {
                    alert('Invalid Credentials!!');
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
}
