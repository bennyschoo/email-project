const form = document.getElementById("login-form");
const success = document.getElementById("alert-success");
const failure = document.getElementById("alert-failure");
success.classList.add(["d-none"]);
failure.classList.add(["d-none"]);

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const email = document.getElementById('email');
    let password1 =  document.getElementById('password');
    let password2 = document.getElementById('password2');

    if(password1.value != password2.value){
    alert("The Passwords Do not Match!");
    return;
    }
    
    let data = {
        "email":email.value,
        "password":password1.value
    }
    email.value="";
    password1.value="";
    password2.value="";
    data = JSON.stringify(data);
    sendData(data);
});

async function sendData(data){
    const res = await fetch("/api/new_account", {
        "method":"POST",
        "body": data
    });
    if(res.ok){
        success.classList.remove(["d-none"]);
        success.classList.add(["d-flex"]);

        setTimeout(()=>{
            window.location="/login";
        },1500)
    }
    else{
        console.log(res.status);
        
        failure.classList.remove(["d-none"]);
        failure.classList.add(["d-flex"]);
    }
}