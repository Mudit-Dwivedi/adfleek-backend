const express = require('express');
const app = express();
const db = require('./src/config/db');
const router = require('./src/routes/auth.routes');
const bodyParser = require('body-parser');

// Middleware should be in this order:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.json()); // This can be redundant with bodyParser.json()

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("Hello Adfleek users");
});

app.use('/api/auth', router);

app.listen(port, () => {
  console.log(`Adfleek Server connected at port ${port}`);
});