# Assignment $: Email Website - Node.js using Express.js

__Name:__ Ben Schoonhoven
__Banner:__ B00954933
__Date:__ March 10th, 2025
__Git URL:__ https://git.cs.dal.ca/courses/2025-winter/csci-2170/assignments/a4/schoonhove.git


## Application Name and description

This Email website is called BMail.online, with the B standing for Ben, which is my name.
The website has 5 pages total consisting of a login page, an account creation page, an inbox/sent mail page, a message creation page, and an error page.  
    
The Account creation page lets the user create their own account, with their password being hashed with a salt before being added to the database. The account creation page also makes sure the user enters a valid password and email before proceeding.    

The login page allows a user to login to their inbox. The password sent from the login page is hashed on the server and compared to the hash stored in the database. This ensures the raw password is not stored on the database.  

The inbox consists of 3 top buttons and a main emails list view. The 3 top buttons allow the user to create new mail, switch between inbox view or sent mail view, and logout. The main emails list can either display incoming mail or outgoing mail, changing using the toggle button at the top. The inbox toggling feature is fully implemented using client side js and is all on one page.

## Steps to Setup and Run the Application

1. Install a mySql database and have it running locally on port 3306
2. Run the contents of the ./db/db_dump.sql as a query into the database.   
   This will create the proper schemas and 2 dummy accounts to test. The user names are traccie@gmail.com and ben@gmail.com, with the passwords being Iamcool1 and Pass1234 respectively
3. Make sure you have Node installed and run "npm install" in the main directory of this project. This should install the dependancies.
4. Make sure all web hosting applications are shut down. This program uses port 80 and will not work if any other web server is running.
5. run "npm start" and the server should start running. Fix any errors that are displayed in the console if not.


## List of Features 
+ User accounts and sessions
+ Email sending and receiving
+ Inbox polling, fetching every 3 seconds for new mail
+ Last login time displayed at top of inbox
+ Account creation
+ Password hashing with salt for secure login

## APIs and Webpage URLs
+ Authentication API: /api/request_login  
  Accepts JSON in the format: {
        "email":email.value,
        "password":password1.value
    }
+ Logout API: /api/logout
+ New Mail API: /api/sendmail  
  Accepts JSON in the format: {
        "recipient": recipient.value,
        "subject":subject.value,
        "body":body.value
    }  
+ Retrive mail API: /api/retrieve  
  Accepts JSON in the format: {"time":("0")|("YYYY-MM-DD HH-MM-SS"), "type":("incoming")|("outgoing")}  

+ New Account API: /api/new_account  
  Accepts JSON in the format: {
        "email":email.value,
        "password":password1.value
    }

+ Login Page: /login
+ Create account page: /create-account
+ Inbox page: /inbox
+ Send mail page: /new-mail

## Citations
Bootstrap pre-made footer: https://github.com/twbs/bootstrap/archive/v5.3.3.zip  
Date Conversion functions found in ./exports/dateFunctions: https://stackoverflow.com/a/65558183  
Node File Structure: https://www.geeksforgeeks.org/folder-structure-for-a-node-js-project/

## File structure

The file structure I used is mostly based on a file structure I found online. The source is linked above.
The inspiration file sturcture is the recommended file structure for a node project. This file structure consists of two main folders: 
public and src. The public folder consists of all the documents that are to be accessed by anyone/for the server to serve. The src folder 
contains documents for the workings of the server. To clarify some possibly confusing folders, the "models" folder contains all the documents
that define the database model for the server. The routes folder is used to split up the app.js into multiple sectioned files. In this case I used 
one file for the API routes and one folder for the base/page routes. 