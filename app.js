const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./routes/routes')

const app = express();

app.use(bodyParser.json());
app.use('/', router);
// app.use('/users', router);



module.exports = app;