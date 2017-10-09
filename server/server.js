const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const app = express();

mongoose.connect("mongodb://localhost/my_database");

mongoose.Promise = global.promise;
// Setting view engine to use `ejs` instead of default html
app.set("view engine", "ejs");

// middlewares
app.use(express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

// ---------- Root Route ----------

routes(app);

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
