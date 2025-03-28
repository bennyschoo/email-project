CREATE DATABASE IF NOT EXISTS email_db;

USE email_db;

CREATE TABLE IF NOT EXISTS login(
uid INT NOT NULL AUTO_INCREMENT , 
email VARCHAR(70) NOT NULL ,
password TEXT NOT NULL , 
salt TEXT NOT NULL ,
PRIMARY KEY (uid),
UNIQUE (email)
); 


CREATE TABLE IF NOT EXISTS emails(
    eid INT NOT NULL AUTO_INCREMENT , 
    sid INT NOT NULL , 
    rid INT NOT NULL , 
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
insert into login (email, password, salt) values ("ben@gmail.com","dgK4ayn9Pi0IHPWTEzrmHhxARCO5WQ8bWUbKRYf6QWZwfZCJlmKqqeb+2rgd3vkg4yZReLNydxopVlhNxvmzQw==","sKV3HbfblllcGHxFsihET8VUNKVv6+pK8QH81/Xd/BffsGuf5DGlTX5G5tk4zW2lnyM0nPnyu+965m8jWQcLDe8VURgnlLrCTxjJc3BOjRXtBu7Q2ihCp6FiBIuGq8Y/EYltujj9n8/Q7NQX7WP/F0TM9j4qh4ymklqVu2FytuQ=");

-- Default user traccie@gmail.com password: Iamcool1
insert into login (email, password, salt) values ("traccie@gmail.com","eGBFgJFyPVnUweWjL51Uo1E/3M84RAGZ2viqXVuflxiZeKIwWXmi4dQ3mhvoeFffKe5n6KC+ot22arnxAx53Pg==","cRO06ARGsX64FYCD+NOj9/X6bRv2w58Y1xuEaVnM8qCEWK6v86Z9r9/k01lwybB9fSx5PRdxUhTK4y0n0WlrrLakx9/Y0dpcRzEvcOHm7uYWTySsJyYgucn0As4sumuZ7PjaIjm8xeMW9/ATNSarjsNQnDUv3DGMG3IcFClJUN0=");
