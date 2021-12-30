const mongoose = require('mongoose');
const account = require('../model/accountModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AppError = require('./../utils/appError');
const bcrypt =require('bcryptjs');

const comparePassword = async (password, hash) => {
    // try {
        // Compare passwor
        return await bcrypt.compare(password, hash);
    // } catch (error) {
    //     console.log(error);
    // }
 
    // Return false if error
    // return false;
};
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.getAllAccounts = catchAsync(async (req, res, next) => {

    const allAccounts = await account.find();
    res.status(200).json({
        status: 'success',
        quantity: account.length,
        accounts: {
            allAccounts
        }

    });

});

exports.signup = catchAsync(async (req, res, next) => {

    const newAccount = await account.create({

        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newAccount._id)
    res.status(201).json({
        status: "sucess",
        message: "account has been created",
        token,
        data: {
            Account: newAccount
        }

    })


})
exports.login = catchAsync(async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const accountLog = await account.findOne({ email });
        // .select('+password');
    console.log(accountLog);

    const isValidPass = await comparePassword(password, accountLog.password);
    
    
 
    // const correct= await accountLog.correctPassword(password, accountLog.password);
    // if (!correct){
    //     console.log('issue in password function')
    // }

    // const check= await bcrypt.compare(password, accountLog.password);

    if (!accountLog.email || !isValidPass ) {
        return next(new AppError('Incorrect email or password', 401));
    }

    console.log(accountLog);
    const token = signToken(accountLog._id);
    res.status(200).json({
        status: 'success', 
        token

    });
});
