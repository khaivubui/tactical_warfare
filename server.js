import express from  'express';

const app = express();

// ---------- Root Route ----------

app.get(
  '/',
  (req, res) => {
    res.render('root.html');
  }
);

// ---------- Start Server ----------

const port = process.env.PORT || 3000;

app.listen(
  port,
  () => console.log(`Server started on port ${port}`)
);
