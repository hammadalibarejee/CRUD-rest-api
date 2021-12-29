const mongoose= require('mongoose');
const account=require('../model/accountModel');
const catchAsync= require('./../utils/catchAsync');
const jwt= require('jsonwebtoken');
require('dotenv').config();

exports.signup=catchAsync(async (req,res,next)=>{
    
    const newAccount= await account.create({
        
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

    const token=jwt.sign({id:newAccount._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
    res.status(201).json({
        status:"sucess",
        message:"account has been created",
        token,
        data:{
            Account:newAccount
        }
        
    })
    

})