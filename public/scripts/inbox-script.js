const emailsContainer = document.getElementById("emails-container");
let emailData = [];
var updateInbox;
const inboxButton = document.getElementById("toggle-inbox");

function updateLastLogin(){
    let cookies=document.cookie.split(";");
    let lastLogin="";
    for(let i=0; i<cookies.length;i++){
        if(cookies[i].includes("last_login")){
            lastLogin=cookies[i].split("=")[1];
        }
    }
    if(lastLogin==""){
        lastLogin="Never";
    }
    lastLogin = decodeURIComponent(lastLogin);
    let lastlogElement = document.getElementById("last-login");
    lastlogElement.textContent = `Last Login: ${lastLogin}`;
}

async function fetchAllEmails(){
    const res = await fetch("/api/retrieve", {"method":"POST", 'body':'{"time":"0", "type":"incoming"}'});
    const data = await res.json();
    emailData = data;


    loadInbox(data, "From");
    updateInbox = setInterval(fetchNewMail,1000*3);
}


function createMailItem(data, fromTo){
    let emailContainer = document.createElement("div");
    emailContainer.classList = "border-bottom border-light";

        let emailButton = document.createElement("div");
        emailButton.classList = "container-fliud d-flex justify-content-between p-2 email-drop-button";

            let subjectContainer = document.createElement("div");
            subjectContainer.classList="d-flex";

                let caret = document.createElement("img");
                caret.setAttribute("alt","caret indicting email content dropdown");
                caret.setAttribute("src", "/public/svg/caret-down.svg");
                caret.classList = "my-auto me-3";
                caret.setAttribute("height","25");
                caret.setAttribute("width","25");

                let emailSubject = document.createElement("h5");
                emailSubject.classList = "text-center my-auto";
                emailSubject.textContent = data.subject;
            
            subjectContainer.appendChild(caret);
            subjectContainer.appendChild(emailSubject);

            let sendInfoBox = document.createElement("div");
            sendInfoBox.classList = "my-auto";

                let sender = document.createElement("h5");
                sender.classList="text-center my-auto";
                sender.textContent = fromTo + ": " + data.email;

                let datetime = document.createElement("h6");
                datetime.classList = "text-center my-auto";
                datetime.textContent = data.sent;
            
            sendInfoBox.appendChild(sender);
            sendInfoBox.appendChild(datetime);
        
        emailButton.appendChild(subjectContainer);
        emailButton.appendChild(sendInfoBox);

        let emailContentBox = document.createElement("div");
        emailContentBox.classList="container-xs mx-5 px-5 my-1 mb-3 email-contents-box";
            
            let emailContentText = document.createElement("h5");
            emailContentText.textContent = data.body;
        
        emailContentBox.appendChild(emailContentText);
    
    emailContainer.appendChild(emailButton);
    emailContainer.appendChild(emailContentBox);
    
    emailButton.addEventListener("click", (event)=>{
        event.preventDefault();
        toggleEmail(caret,emailContentBox);
    });
    return emailContainer;
}

function toggleEmail(caret,contentBox){
if(caret.src.includes("down")){
    caret.src = "/public/svg/caret-up.svg";
    contentBox.classList.add("email-show");
}
else if(caret.src.includes("up")){
    caret.src = "/public/svg/caret-down.svg";
    contentBox.classList.remove("email-show");
}
}

async function fetchNewMail(){
    let newestTime = "0";
    if(emailData.length!=0){
        newestTime = emailData[0].sent;
    }
    const res = await fetch("/api/retrieve",{"method":"POST", "body":`{"time":"${newestTime}", "type":"incoming"}`});
    const data = await res.json();
    if(data.length==0){
        return;
    }
    if(data.length>0 && emailData.length==0){
        emailsContainer.innerHTML = "";
    }
    emailData = data.concat(emailData);

    for(let i=data.length-1; i>=0; i--){
        let emailElement = createMailItem(data[i], "From");
        emailsContainer.insertBefore(emailElement,emailsContainer.children[0]);
    }
}

async function toggleInbox(){
    if(inboxButton.children[0].textContent.includes("Sent")){
        clearInterval(updateInbox);
        inboxButton.children[0].textContent = "View Inbox";
        let res = await fetch("/api/retrieve",{"method":"POST", "body":`{"time":"0", "type":"outgoing"}`});
        const data = await res.json();
        
        loadInbox(data, "To");
      
    }
    else if(inboxButton.children[0].textContent.includes("Inbox")){
        inboxButton.children[0].textContent = "View Sent";
        loadInbox(emailData, "From");
        updateInbox = setInterval(fetchNewMail,1000*3);

    }
    
}

function createNoMailMessage(){
    let noEmails = document.createElement("h4");
    noEmails.classList = "text-center py-3";
    noEmails.textContent = "No Emails Found";
    return noEmails;
}

function loadInbox(data, fromTo){
    emailsContainer.innerHTML = "";

    if(data.length==0){
        let noEmails = createNoMailMessage();
        emailsContainer.appendChild(noEmails);
    }

    for(let i=0; i<data.length; i++){
        let emailElement = createMailItem(data[i], fromTo);
        emailsContainer.appendChild(emailElement);
    }
}



updateLastLogin();
fetchAllEmails();
inboxButton.addEventListener("click", toggleInbox);
document.getElementById("logout-button").addEventListener("click", (event)=>{
    event.preventDefault();
    fetch("/api/logout",{"method":"POST"}).then((res)=>{
        if(res.status==200){
            window.location.href = "/login";
        }
    });
});