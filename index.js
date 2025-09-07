const express = require('express');
const app = express();
const postgres = require('./src/config/db/postgres');
const mongo = require('./src/config/db/mongo');
const bodyParser = require('body-parser');

const router = require('./src/routes/index');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.json()); 

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("Hello Adfleek users");
});
mongo.connect();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Adfleek Server connected at port ${port}`);
});