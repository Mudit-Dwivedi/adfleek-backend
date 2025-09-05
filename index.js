const express = require('express');
const app = express();
const postgres = require('./src/config/db/postgres');
const mongo = require('./src/config/db/mongo');

const router = require('./src/routes/auth.routes');
const routerChat = require('./src/routes/chat.routes');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.json()); // This can be redundant with bodyParser.json()

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("Hello Adfleek users");
});
mongo.connect();

app.use('/api/auth', router);
app.use('/api/chat', routerChat);

app.listen(port, () => {
  console.log(`Adfleek Server connected at port ${port}`);
});