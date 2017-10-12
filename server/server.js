// APP SERVER
const passport = require("passport");
const cors = require("cors");
const path = require("path");


const users = require("./routes/users");
const config = require('./config/database');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const routes = require("./routes/routes");
const webSockets = require('./websockets/websockets');

mongoose.Promise = global.Promise;

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to database ${config.database}`);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log(`Database error: ${err}`);
});


// Setting view engine to use `ejs` instead of default html
app.set("view engine", "ejs");

// CORS Middleware
app.use(cors());

// middlewares
app.use(express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

app.use('/users', users);

// ---------- Root Route ----------

routes(app);

// ---------- socket.io stuff ----------

webSockets(io); // ./websockets/websockets.js

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

http.listen(port, () => console.log(`Server started on port ${port}`));
