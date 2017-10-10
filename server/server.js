// APP SERVER

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const passport = require("passport");
const cors = require("cors");
const path = require("path");


const users = require("./routes/users");
const config = require('./config/database');

const app = express();

mongoose.Promise = global.Promise;

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to databse ${config.database}`);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log(`Database error: ${err}`);
});


// Setting view engine to use `ejs` instead of default html
app.set("view engine", "ejs");

// CORS Middleware
app.use(cors());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// middlewares
app.use(express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

app.use('/users', users);

// ---------- Root Route ----------

routes(app);
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
