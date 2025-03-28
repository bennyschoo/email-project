const emailsContainer = document.getElementById("emails-container");
let emailData = [];

function updateLastLogin(){
    let cookies=document.cookie.split(";");
    let lastLogin="";
    for(let i=0; i<cookies.length;i++){
        if(cookies[i].includes("last_login")){
            lastLogin=cookies[i].split("=")[1];
        }
    }
    if(lastLogin==""){
        return;
    }
    lastLogin = decodeURIComponent(lastLogin);
    let lastlogElement = document.getElementById("last-login");
    lastlogElement.textContent = `Last Login: ${lastLogin}`;
}

async function fetchAllEmails(){
    const res = await fetch("./retrieve", {"method":"POST", 'body':'{"time":"0"}'});
    const data = await res.json();
    emailData = data;



    if(data.length==0){
        let noEmails = document.createElement("h4");
        noEmails.classList = "text-center py-3";
        noEmails.textContent = "Inbox Empty";
        emailsContainer.appendChild(noEmails);
    }
    for(let i=0; i<data.length; i++){
        let emailElement = createMailItem(data[i]);
        emailsContainer.appendChild(emailElement);
    };

}


function createMailItem(data){
    let emailContainer = document.createElement("div");
    emailContainer.classList = "border-bottom border-light";

        let emailButton = document.createElement("div");
        emailButton.classList = "container-fliud d-flex justify-content-between p-2 email-drop-button";

            let subjectContainer = document.createElement("div");
            subjectContainer.classList="d-flex";

                let caret = document.createElement("img");
                caret.setAttribute("alt","caret indicting email content dropdown");
                caret.setAttribute("src", "./assets/svg/caret-down.svg");
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
                sender.textContent = "From: " + data.email;

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
    caret.src = "./assets/svg/caret-up.svg";
    contentBox.classList.add("email-show");
}
else if(caret.src.includes("up")){
    caret.src = "./assets/svg/caret-down.svg";
    contentBox.classList.remove("email-show");
}
}

async function fetchNewMail(){
    let newestTime = "0";
    if(emailData.length!=0){
        newestTime = emailData[0].sent;
    }
    console.log(newestTime);
    const res = await fetch("./retrieve",{"method":"POST", "body":`{"time":"${newestTime}"}`});
    const data = await res.json();
    console.log(data);
    if(data.length==0){
        return;
    }
    if(data.length>0 && emailData.length==0){
        emailsContainer.innerHTML = "";
    }
    emailData = data.concat(emailData);

    for(let i=data.length-1; i>=0; i--){
        let emailElement = createMailItem(data[i]);
        emailsContainer.insertBefore(emailElement,emailsContainer.children[0]);
    }
}

updateLastLogin();
fetchAllEmails();
setInterval(fetchNewMail,1000*3);
