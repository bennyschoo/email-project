const express = require("express");
const app = express();
const pages = require("./src/routes/pageRequests.js");
const APIS = require("./src/routes/APIRequests.js");

// Server parameters
const port = 80;
const host = "192.168.0.25";

app.use("/", pages);
app.use("/api", APIS);


app.listen(port,host);
