const { promisify } = require("util");
const mongoose = require("mongoose");
const account = require("../model/accountModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const AppError = require("./../utils/appError");
const bcrypt = require("bcryptjs");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

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
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const allAccounts = await account.find();
  res.status(200).json({
    status: "success",
    quantity: account.length,
    accounts: {
      allAccounts,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const newAccount = await account.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newAccount._id);
  res.status(201).json({
    status: "sucess",
    message: "account has been created",
    token,
    data: {
      Account: newAccount,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
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

  if (!accountLog.email || !isValidPass) {
    return next(new AppError("Incorrect email or password", 401));
  }

  console.log(accountLog);
  const token = signToken(accountLog._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return next(new AppError("You are not logged in the API", 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentAccount = await account.findById(decoded.id);
  if (!currentAccount) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentAccount.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.account = currentAccount;
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const forgotAccount = await account.findOne({ email: req.body.email });

  if (!forgotAccount) {
    return next(new AppError("There is no such user found", 404));
  }
  const resetToken = forgotAccount.createPasswordResetToken();
  await forgotAccount.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/forgotPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to:${resetURL}\n If you didn't forgot your password just ignore this.`;
  try {
    await sendEmail({
      email: forgotAccount.email,
      subject: "Your password reset token valid for 10 min",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    forgotAccount.createPasswordResetToken = undefined;
    forgotAccount.createPasswordResetTokenExpires = undefined;
    await forgotAccount.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const forgotAccount = await account.findOne({
    createPasswordResetToken: hashedToken,
    createPasswordResetTokenExpires: { $gt: Date.now() },
  });

  if (!forgotAccount) {
    return next(new AppError("Token is invalid or has expired ", 400));
  }
  forgotAccount.password = req.body.password;
  forgotAccount.passwordConfirm = req.body.passwordConfirm;
  forgotAccount.createPasswordResetToken = undefined;
  forgotAccount.createPasswordResetTokenExpires = undefined;
  await forgotAccount.save();

  const token = signToken(forgotAccount._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  var token = req.headers.authorization;
  const oldPassword = req.body.oldPassword;
  // Checking the token if exists

  console.log(token);
  if (!token) {
    return next(new AppError("You are not logged in the API", 401));
  }

  //Verifying the token and finding that account by token
  const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentAccount = await account.findById(decoded.id);
  if (!currentAccount) {
    return next(new AppError("Account not found!:"), 401);
  }

  const isValidPass = await comparePassword(
    oldPassword,
    currentAccount.password
  );
  if (!isValidPass){
    return next(new AppError('Your old password is not correct '),401);
  }
  const password= req.body.password;
  const passwordConfirm=req.body.passwordConfirm;
  
  await currentAccount.update({
      password:password,
      passwordConfirm:passwordConfirm

  });
  token = signToken(currentAccount._id);
  
  console.log(token);

  res.status(200).json({
      status:'success',
      message:'The password have been changed successfuly',
      token,
      updatedAccount:{
          currentAccount
      }
  })


});
