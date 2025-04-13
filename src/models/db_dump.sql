CREATE DATABASE IF NOT EXISTS message_db;

USE message_db;

CREATE TABLE IF NOT EXISTS login(
uid VARCHAR(128) NOT NULL, 
username VARCHAR(70) NOT NULL ,
password TEXT NOT NULL , 
salt TEXT NOT NULL ,
PRIMARY KEY (uid),
UNIQUE (username)
); 


CREATE TABLE IF NOT EXISTS messages(
    eid int NOT NULL AUTO_INCREMENT , 
    sid VARCHAR(128) NOT NULL , 
    rid VARCHAR(128) NOT NULL , 
    subject TEXT NOT NULL , 
    body MEDIUMTEXT NOT NULL , 
    sent DATETIME NOT NULL,
    PRIMARY KEY (eid),
    FOREIGN KEY (sid)
        REFERENCES login (uid),
    FOREIGN KEY (rid)
        REFERENCES login (uid)
);

