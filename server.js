const express = require('express');

const app = express();

// Setting view engine, ejs default directory is `views/`
app.set('view engine', 'ejs');

// ---------- Root Route ----------

app.get(
  '/',
  (req, res) => {
    res.render('root');
  }
);

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

app.listen(
  port,
  () => console.log(`Server started on port ${port}`)
);
