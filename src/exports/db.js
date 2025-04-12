const dbconfig = require ("./config");
const mysql = require ("mysql");

const db = mysql.createConnection(dbconfig.db_params);

db.connect((err)=>{
    if(err) throw err;
});

exports.db = db;
