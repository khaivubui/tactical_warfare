const express = require('express');

const routes = require('./routes');

const app = express();

// Setting view engine to use `ejs` instead of default html
app.set('view engine', 'ejs');

// middlewares
app.use(express.static(`${__dirname}/../public`));

// ---------- Root Route ----------

routes(app);

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

app.listen(
  port,
  () => console.log(`Server started on port ${port}`)
);
