const form = document.getElementById("login-form");
const success = document.getElementById("alert-success");
const failure = document.getElementById("alert-failure");
success.classList.add(["d-none"]);
failure.classList.add(["d-none"]);

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    let email = document.getElementById('email');
    let password =  document.getElementById('password');
    let data = {
        "email":email.value,
        "password":password.value
    }
    email.value = "";
    password.value= "";
    data = JSON.stringify(data);
    login(data);
});

async function login(data){
    const res = await fetch("./request_login", {
        "method":"POST",
        "body": data
    });
    if(res.ok){
        success.classList.remove(["d-none"]);
        success.classList.add(["d-flex"]);

        setTimeout(()=>{
        window.location="./inbox";
        },800);
    }
    else{
        console.log(res.status);

        failure.classList.remove(["d-none"]);
        failure.classList.add(["d-flex"]);
    }
}