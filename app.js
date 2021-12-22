const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./routes/routes')

const app = express();

app.use(bodyParser.json());
app.use('/', router);
// app.use('/users', router);
app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:"failed",
        message:`Can't find ${req.originalUrl} on this server`
    })
})


module.exports = app;