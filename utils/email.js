const nodemailer= require('nodemailer');
const sendEmail= async options =>{
    // Created the transports 

    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    });

    // Defining the mail options 
    
    var mailOptions = {
        from:process.env.EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.message 
    };
    //Sending email

    await transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }
        else{
            console.log('Email Sent:', info.response);
        }
    });
};

module.exports=sendEmail;