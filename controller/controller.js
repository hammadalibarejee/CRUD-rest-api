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