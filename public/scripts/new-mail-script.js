const form = document.getElementById("mail-form");
const success = document.getElementById("alert-success");
const failure = document.getElementById("alert-failure");
success.classList.add("d-none");
failure.classList.add("d-none");

form.addEventListener("submit", event=>{
    event.preventDefault();
    let recipient = document.getElementById("recipient-box");
    let subject = document.getElementById("subject-box");
    let body = document.getElementById("message-body");
    let data = {
        "recipient": recipient.value,
        "subject":subject.value,
        "body":body.value
    }
    data = JSON.stringify(data);
    recipient.value = "";
    subject.value = "";
    body.value = "";

    sendData(data);

});

async function sendData(data){
    const res = await fetch("/api/sendmail", {
        "method":"POST",
        "body": data
    });
    if(res.ok){
        success.classList.remove("d-none");
        success.classList.add("d-flex");

        setTimeout(()=>{
            window.location="/inbox";
        },1200);
    }
    else{
        console.log(res.status);

        failure.classList.remove("d-none");
        failure.classList.add("d-flex");
    }
}