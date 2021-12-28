const mongoose= require('mongoose');
const account=require('../model/accountModel');
const catchAsync= require('./../utils/catchAsync');

exports.signup=catchAsync(async (req,res,next)=>{
    
    const newAccount= await account.create({
        
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
    res.status(201).json({
        status:"sucess",
        Account:newAccount
    })
    

})