const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const routes = require("./routes/routes");

mongoose.Promise = global.Promise;

//Connect to mongodb
const promise = mongoose.connect("mongodb://localhost/tactical_warfare", {
  userMongoClient: true
});

//Catch success or failure
promise
  .then(() => {
    console.log("Connection has been made");
  })
  .catch(err => {
    console.log("Connection error:", err.stack);
  });

// Setting view engine to use `ejs` instead of default html
app.set("view engine", "ejs");

// middlewares
app.use(express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

// ---------- Root Route ----------

routes(app);

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

http.listen(port, () => console.log(`Server started on port ${port}`));
