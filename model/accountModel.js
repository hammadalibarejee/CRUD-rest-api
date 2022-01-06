const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const asyncCatch = require('../utils/catchAsync');
const catchAsync = require('../utils/catchAsync');
const crypto= require('crypto');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be defined']
    },
    email: {
        type: String,
        required: [true, 'valid email address must be defined'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Kindly provide a password for your account'],
        minlength: 8,
        // select: false

    },
    passwordConfirm: {
        type: String,
        required: [true, 'Kindly provide confirmation password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'password are not same'
        }

    },
    passwordChangedAt: Date,
    passwrodResetToken:String,
    passwrodResetTokenExpires:Date
});
// accountSchema.pre('save',asyncCatch(async function(next){
//     // Only run if password is actually modified 
//     if (!this.isModified('password')) return next();

//     //Hashing the given password 
//     this.password= await bcrypt.hash(this.password,12);

//     this.passwordConfirm=undefined;
//     next();
// }));

accountSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
accountSchema.pre('save',async function(next){
    if (!this.isModified('password')|| this.isNew) return next();

    this.passwordChangedAt=Date.now()-1000;
})


// accountSchema.methods.correctPassword = catchAsync(async function (
//     candidiatePassword,
//     accountPassword
// ) {
//     return await bcrypt.compare(candidiatePassword, accountPassword);

// });

accountSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };
accountSchema.methods.createPasswordResetToken= function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwrodResetToken=crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    console.log(resetToken,this.passwrodResetToken); 
    
    this.passwrodResetTokenExpires=Date.now() + 10*60*1000;
    return resetToken;
} ;

const account = mongoose.model('account', accountSchema);
module.exports = account;
