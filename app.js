const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./routes/routes');
const globalError= require ('./utils/appError');
const helmet=require('helmet');
// const rateLimit=require('express-rate-limit');
const mongoSanitize=require('express-mongo-sanitize');
const xssClean=require('xxs-clean');

require('dotenv').config()

const app = express();

// const limiter=rateLimit({
//     max:100,
//     windowMs:60*60*1000,
//     message:'too many request from this IP,Kindly try after an hour'
// });

app.use(helmet());

// Blocks noSql queries 

app.use(mongoSanitize());


//Data Sanitization 

app.use(xxsClean());

// app.use('/api',limiter);
app.use(bodyParser.json());
app.use('/api', router);
// app.use('/users', router);
app.all('*',(req,res,next)=>{
//     res.status(404).json({
//         status:"failed",
//         message:`Can't find ${req.originalUrl} on this server`
//     })
    const err=new Error(`Can't find ${req.originalUrl} on this server`);
    err.status='fail';
    err.statusCode=404;
    next(err); 7

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