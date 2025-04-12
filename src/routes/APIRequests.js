const express = require("express");
const router = express.Router();
const db = require("../exports/db.js").db;
const session = require("express-session");
const {check} = require("express-validator");
const dates = require("../exports/dateFunctions.js");
const crypto = require("crypto");
const digest = "sha512";


router.use(session({
    secret: 'not-secret',
    resave: false,
    saveUninitialized: false
}))


router.post("/request_login", [
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

            let salt = results[0].salt;
            let passMatch = results[0].password == crypto.hash(digest,password+salt).toString("base64");
            if(passMatch){
                req.session.loggedin = true;
                req.session.uid = results[0].uid;
                req.session.email = email;
                res.writeHead(200,{
                    "Content-Type":"application/json",
                    "Set-Cookie":`last_login=${new Date().toLocaleString()}; path=/;`
                });
                res.end(JSON.stringify({"success":"Login Successful"}));
            }
        });
    })
});


router.post("/new_account", [
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

            let salt = crypto.randomBytes(64).toString("base64");
            let hash = crypto.hash(digest,password+salt).toString("base64");
            let uid = crypto.hash("SHA1", email+password); // create unique Ids for each user
            query = "insert into login (uid,email,password,salt) values (?,?,?,?);"
            db.query(query,[uid,email,hash,salt], (err,results,fields)=>{
                if(err) throw err;
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify({"success":"Account Created"}));
            });
        });
    })
});

router.post("/logout", (req,res)=>{
    req.session.destroy();
    res.writeHead(200,{
        "Set-Cookie":`last_login=${new Date().toLocaleString()}; path=/;`
    });
    res.end();
});

router.post("/retrieve", [
    check('time'),
    ], (req,res)=>{
        req.on("data", (chunk)=>{
            let data = JSON.parse(chunk.toString());
            let time = data.time;
            let incoming = data.type == "incoming";
            let query = "select E.subject,E.body,E.sent,L.email from emails E inner join login L on E.rid = L.uid where E.sid = ? AND E.sent > ? order by sent desc;"
            if(time == "0"){
                time = "0000-00-00 00:00:00";
            }
            if(incoming){
                query = "select E.subject,E.body,E.sent,L.email from emails E inner join login L on E.sid = L.uid where E.rid = ? AND E.sent > ? order by sent desc;"
            }
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

router.post("/sendmail", [
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

module.exports = router;