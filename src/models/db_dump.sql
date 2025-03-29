CREATE DATABASE IF NOT EXISTS email_db;

USE email_db;

CREATE TABLE IF NOT EXISTS login(
uid VARCHAR(128) NOT NULL, 
email VARCHAR(70) NOT NULL ,
password TEXT NOT NULL , 
salt TEXT NOT NULL ,
PRIMARY KEY (uid),
UNIQUE (email)
); 


CREATE TABLE IF NOT EXISTS emails(
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

-- Default user ben@gmail.com password: Pass1234
insert into login (uid, email, password, salt) values ("474dd0719e643ef1596791f415900edba8420c85","ben@gmail.com","0b271c885f3375795c9bdf9ad8d605b00f7fcb9ccf8860d0221b0793ca9f624e589c9d94e0d1756986bd375a76b8fb76422d3d97eba66507e96834b588af215e","fIh+wk9Vr5m07S/3I1nxOOEV46nrmyA+cPMXX0YYe6nVmQNEesbquqC414qm6gNu7oje3Y9sazl3Fe7wKttusg==");

-- Default user traccie@gmail.com password: Iamcool1
insert into login (uid, email, password, salt) values ("e6967dedaac705a3af5855217ac93b6e4eee4f0e","traccie@gmail.com","5d46025000bbf53e8cbaa7380052bc15f8d12db6ddc7b34785279d34406e8a843fefeedcc56d384a453a1b97ded40678e3837589005f4955c0a7f13c2d22b43c","VoxFrRhXWKgSNG5PdbPaULUmqHnjGTAmOUsXG1WrcUeJYVDC4FEOVx8aGtedhmrsk4C/L97397ArNXyPqOIhfg==");
