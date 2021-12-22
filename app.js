const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./routes/routes');
const globalError= require ('./utils/appError');

const app = express();

app.use(bodyParser.json());
app.use('/', router);
// app.use('/users', router);
app.all('*',(req,res,next)=>{
//     res.status(404).json({
//         status:"failed",
//         message:`Can't find ${req.originalUrl} on this server`
//     })
    const err=new Error(`Can't find ${req.originalUrl} on this server`);
    err.status='fail';
    err.statusCode=404;
    next(err); 

})

// app.use((err,req,res,next)=>{
//     err.statusCode= err.statusCode || 500;
//     err.status=err.status || 'error'; 

//     err.status(err.statusCode).json({
//         status:err.status,
//         message:err.message
//     })
// })
app.use(globalError);


module.exports = app;