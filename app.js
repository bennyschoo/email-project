const express = require("express");
const app = express();
const pages = require("./src/routes/pageRequests.js");
const APIS = require("./src/routes/APIRequests.js");
const http = require("http");
const https = require("https");

// Server parameters
const host = "192.168.0.26";
const options = {
    key: require("fs").readFileSync("src/TLS/key.pem"),
    cert: require("fs").readFileSync("src/TLS/cert.pem"),
}
app.use("/", pages);
app.use("/api", APIS);

http.createServer(app).listen(80, host)
https.createServer(options, app).listen(443, host);