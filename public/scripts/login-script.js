const form = document.getElementById("login-form");
const success = document.getElementById("alert-success");
const failure = document.getElementById("alert-failure");
success.classList.add(["d-none"]);
failure.classList.add(["d-none"]);

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    let username = document.getElementById('username');
    let password =  document.getElementById('password');
    let data = {
        "username":username.value,
        "password":password.value
    }
    username.value = "";
    password.value= "";
    data = JSON.stringify(data);
    login(data);
});

async function login(data){
    const res = await fetch("/api/request_login", {
        "method":"POST",
        "body": data
    });
    if(res.ok){
        success.classList.remove(["d-none"]);
        success.classList.add(["d-flex"]);

        setTimeout(()=>{
        window.location="/inbox";
        },800);
    }
    else{
        console.log(res.status);

        failure.classList.remove(["d-none"]);
        failure.classList.add(["d-flex"]);
    }
}