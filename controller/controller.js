const model = require('./../model/model');



exports.welcome = (req, res) => {
    res.status(200).send('Hello World and Wellcome to the rest api');

}
exports.getData = async (req, res) => {
    try {
        const users = await model.find();
        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                users
            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.postData = async (req, res) => {
    try {
        // const newUser =await model.save(req.body.name,req.body.email,req.body.address);
        const newUser =  new model(req.body)
        await newUser.save();
        console.log(newUser);
        // res.status(200).send({
        //     data:[req.body],
        //     message:"success"
        // })
        // console.log("Hello",req.body);


        res.status(201).json({
            status: "success",
            data: {
                newUser
            }

        })
    }
    catch (err) {
        console.log(err);
    }
}

exports.updateData= async (req,res)=>{
    try{
        const user= await model.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            status:'success',
            data:{
                user:user
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:'failed',
            message:err
        })
    }
}
exports.deleteData= async (req,res)=>{
    try {
        model.findByIdAndRemove(req.params.id)
        res.status(200).send('Data deleted successfully');

    }
    catch (err){
        console.log(err)
        res.status(500).send(err)

    }
}