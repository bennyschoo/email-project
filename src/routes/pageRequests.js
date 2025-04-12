const express = require("express");
const router = express.Router();
const fs = require("fs");
const session = require("express-session");

const headerhtml = fs.readFileSync("./public/templates/header.html");
const footerhtml = fs.readFileSync("./public/templates/footer.html");
const loginhtml = fs.readFileSync("./public/templates/login.html");
const inboxhtml = fs.readFileSync("./public/templates/inbox.html");
const newmailhtml = fs.readFileSync("./public/templates/new_mail.html");
const newaccounthtml = fs.readFileSync("./public/templates/new_account.html");
const pageNotFoundhtml = fs.readFileSync("./public/templates/notfound.html");

router.use('/public',express.static('public'));
router.use(session({
    secret: 'not-secret',
    resave: false,
    saveUninitialized: false
}))


router.get("/", (req,res)=>{
    res.writeHead(302,{"Location":"./inbox"});
    res.end();
});

router.get("/login", (req,res)=>{
    if(req.session.loggedin){
        res.writeHead(302,{"Location":"./inbox"});
        res.end();
        return;
    }
    let outputhtml = headerhtml + loginhtml + footerhtml;
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(outputhtml);
});

router.get("/create-account", (req,res)=>{
    let outputhtml = headerhtml + newaccounthtml + footerhtml;
    res.writeHead(200,{"Content-type":"text/html"});
    res.end(outputhtml);
});

router.get("/new-mail", (req,res)=>{
    if(!req.session.loggedin){
        res.writeHead(302,{"Location":"./login"});
        res.end();
        return;
    }
    
    let outputhtml = headerhtml + newmailhtml + footerhtml;
    res.writeHead(200,{"Content-type":"text/html"});
    res.end(outputhtml)
})

router.get("/inbox",(req,res)=>{
    if(!req.session.loggedin){
        res.writeHead(302,{"Location":"./login"});
        res.end();
        return;
    }
    let outputhtml = headerhtml + inboxhtml + footerhtml;
    outputhtml = outputhtml.replace("!--HELLO--!",`Hello, ${req.session.email}`)
    res.writeHead(200,{"Content-type":"text/html"});
    res.end(outputhtml)
});



router.get("*",(req, res)=>{
    let outputhtml = headerhtml + pageNotFoundhtml + footerhtml;
    res.statusCode = 404;
    res.end(outputhtml);
});



module.exports = router;