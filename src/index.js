const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { getFight, notFound } = require('./controllers');
const { buildRequestHandler } = require('./request-handler');

dotenv.config();

const APP_PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

app.get('/api/fight', buildRequestHandler(getFight));
app.use('*', buildRequestHandler(notFound));

app.listen(APP_PORT, () => {
  console.log(`Server listening in port ${APP_PORT}`);
});
