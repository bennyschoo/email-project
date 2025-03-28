const db = require("./db/db.js").db;
const url = require("url");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const express = require("express");
const cookieParser = require("cookie-parser");
const {check} = require("express-validator");
const dates = require("./exports/dateFunctions");
const crypto = require("crypto");
const app = express();


app.use(cookieParser());
app.use(session({
    secret: 'not-secret',
    resave: false,
    saveUninitialized: false
}))

//Templates
const headerhtml = fs.readFileSync("./templates/header.html");
const footerhtml = fs.readFileSync("./templates/footer.html");
const loginhtml = fs.readFileSync("./templates/login.html");
const inboxhtml = fs.readFileSync("./templates/inbox.html");
const newmailhtml = fs.readFileSync("./templates/new_mail.html");
const newaccounthtml = fs.readFileSync("./templates/new_account.html");

// Server parameters
const port = 8000;
const host = "localhost";
const hashiterations = 10000;
const keylength = 64;
const digest = "sha512";

app.get("/", (req,res)=>{
    res.writeHead(302,{"Location":"./inbox"});
    res.end();
});

app.get("/login", (req,res)=>{
    if(req.session.loggedin){
        res.writeHead(302,{"Location":"./inbox"});
        res.end();
        return;
    }
    let outputhtml = headerhtml + loginhtml + footerhtml;
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(outputhtml);
});

app.get("/create-account", (req,res)=>{
    let outputhtml = headerhtml + newaccounthtml + footerhtml;
    res.writeHead(200,{"Content-type":"text/html"});
    res.end(outputhtml);
});

app.get("/new-mail", (req,res)=>{
    if(!req.session.loggedin){
        res.writeHead(302,{"Location":"./login"});
        res.end();
        return;
    }
    
    let outputhtml = headerhtml + newmailhtml + footerhtml;
    res.writeHead(200,{"Content-type":"text/html"});
    res.end(outputhtml)
})

app.get("/inbox",(req,res)=>{
    if(!req.session.loggedin){
        res.writeHead(302,{"Location":"./login"});
        res.end();
        return;
    }
    let outputhtml = headerhtml + inboxhtml + footerhtml;
    outputhtml = outputhtml.replace("!--HELLO--!",`Hello, ${req.session.email}`) /// FIX LATER ONCE SESSION WORKING!
    res.writeHead(200,{"Content-type":"text/html"});
    res.end(outputhtml)
});

app.get(/\/assets\/(.*)/,(req, res)=>{
    const staticExtensions = {
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.html': 'text/html',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
    };
    const parsedUrl = url.parse(req.url);
    const pathName = parsedUrl.pathname;
    const ext = path.extname(pathName);

    if(staticExtensions[ext]){
        fs.readFile(path.join(__dirname,pathName), (err,data)=>{
            if(err){
                res.writeHead(404, {"Content-type": "test/plain"});
                res.end("Error: Not Found");
                return;
            }
            res.writeHead(200, {"Content-type": staticExtensions[ext]});
            res.end(data);
        });
        return;
    }
    res.statusCode = 404;
    res.end('{"error":"Resource Does not exist"}');
})

// Deal with login requests (login API)
app.post("/request_login", [
    check('email').escape().trim().isEmail().normalizeEmail(),
    check('password').trim().escape().isString()
], (req,res)=>{
    req.on("data", (chunk)=>{
        let data = JSON.parse(chunk.toString());
        let email = data.email;
        let password = data.password;
        let query = "select uid, password, salt from login where email = ?;"
        db.query(query, [email], (err,results,fields)=>{
            if(err) throw err;
            if(results.length == 0){
                res.writeHead(404,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"error":"Email not found"}));
                return;
            }
            // learned how to salt and hash passwords in Node from here: https://stackoverflow.com/a/17201493
            let salt = results[0].salt;
            let passMatch = results[0].password == crypto.pbkdf2Sync(password, salt, hashiterations, keylength, digest).toString("base64");
            if(passMatch){
                req.session.loggedin = true;
                req.session.uid = results[0].uid;
                req.session.email = email;
                res.cookie("last_login", new Date().toLocaleString());
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"success":"Login Successful"}));
            }
        });
    })
});


app.post("/new_account", [
    check('email').escape().trim().isEmail().normalizeEmail(),
    check('password').trim().escape().isString()
], (req,res)=>{
    req.on("data", (chunk)=>{
        let data = JSON.parse(chunk.toString());
        let email = data.email;
        let password = data.password;
        let query = "select uid from login where email = ?;"
        db.query(query, [email], (err,results,fields)=>{
            if(err) throw err;
            if(results.length >0){
                res.writeHead(404,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"error":"Email already exists"}));
                return;
            }
            // learned how to salt and hash passwords in Node from here: https://stackoverflow.com/a/17201493
            let salt = crypto.randomBytes(128).toString("base64");
            let hash = crypto.pbkdf2Sync(password, salt, hashiterations, keylength, digest).toString("base64");
            query = "insert into login (email,password,salt) values (?,?,?);"
            db.query(query,[email,hash,salt], (err,results,fields)=>{
                if(err) throw err;
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"success":"Account Created"}));
            });
        });
    })
});

app.get("/logout", (req,res)=>{
    req.session.destroy();
    res.writeHead(302,{"Location":"./login"});
    res.end();
});

app.post("/retrieve", [
    check('time'),
    ], (req,res)=>{
        req.on("data", (chunk)=>{
            let data = JSON.parse(chunk.toString());
            let time = data.time;
            if(time == "0"){
                time = "0000-00-00 00:00:00";
            }
            let query = "select E.subject,E.body,E.sent,L.email from emails E inner join login L on E.sid = L.uid where E.rid = ? AND E.sent > ? order by sent desc;"
            db.query(query, [req.session.uid,time],(err,results,fields)=>{
                if(err) throw err;
                
                for(let i=0; i<results.length;i++){
                    results[i].sent = dates.toDateTimestamp(results[i].sent);
                }
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify(results));
            });
        });
});

app.post("/sendmail", [
    check("recipient").escape().trim().isEmail().normalizeEmail(),
    check("subject").escape().trim().isString(),
    check("body").escape().trim().isString()
], (req,res)=>{
    req.on("data", (chunk)=>{
        let data = JSON.parse(chunk.toString());
        let recipient = data.recipient;
        let subject = data.subject;
        let body = data.body;
        let query = "select uid from login where email = ?;"
        db.query(query, [recipient], (err,results,fields)=>{
            if(err) throw err;
            if(results.length == 0){
                res.writeHead(404,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"error":"Recipient not found"}));
                return;
            }
            
            let rid = results[0].uid;
            let sid = req.session.uid;
            query = "insert into emails (sid,rid,subject,body,sent) values (?,?,?,?,NOW());"
            db.query(query,[sid,rid,subject,body],(err,results,fields)=>{
                if(err) throw err;
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"success":"Email Sent"}));
            });
        });
    });
});

app.listen(port,host);
