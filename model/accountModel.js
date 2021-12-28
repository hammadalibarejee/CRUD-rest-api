const mongoose= require('mongoose');
const bcrypt= require ('bcryptjs');
const validator= require ('validator');
const asyncCatch=require('../utils/catchAsync');
const catchAsync = require('../utils/catchAsync');

const accountSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name must be defined']
    },
    email:{
        type:String,
        required:[true,'valid email address must be defined'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email address']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Kindly provide a password for your account'],
        minlength:8,

    },
    passwordConfirm:{
        type:String,
        required:[true,'Kindly provide confirmation password'],
        validate:{
            validator:function (el){
                return el===this.password;
            },
            message:'password are not same'
        }

    }
})
// accountSchema.pre('save',asyncCatch(async function(next){
//     // Only run if password is actually modified 
//     if (!this.isModified('password')) return next();

//     //Hashing the given password 
//     this.password= await bcrypt.hash(this.password,12);

//     this.passwordConfirm=undefined;
//     next();
// }));

accountSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });


const account=mongoose.model('account',accountSchema);
module.exports=account;
