require('dotenv').config();
require('./utils');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { PORT, VIRTUAL_PATH, AUTHORIZATION } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const { link } = require('./routes');

const auth = (req, res, next) => {
  const token = req.headers['Authorization'] || req.headers['authorization'];

  if (token != AUTHORIZATION) {
    return res.sendStatus(401);
  }

  return next();
};

app.use(VIRTUAL_PATH + '/short-url', auth, link);

if (fs.existsSync('build')) {
  app.use(VIRTUAL_PATH + '/', express.static(__dirname + '/build'));
  app.get(VIRTUAL_PATH + '/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}`);
});
