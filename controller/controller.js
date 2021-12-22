const model = require('./../model/model');
const asyncCatch=require('./../utils/catchAsync');


exports.welcome = (req, res) => {
    res.status(200).send('Hello World and Wellcome to the rest api');

}
exports.getData = asyncCatch(async (req, res) => {
    
    
    const queryObj = { ...req.query};
    const excludedFeilds = ['page','sort','fields'];
    excludedFeilds.forEach(el=> delete queryObj[el]);

    const users = await model.find(queryObj);
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })
    // try {
       
    // } catch (err) {
    //     console.log(err);
    // }
});

exports.postData = asyncCatch(async (req, res) => {
    // const newUser =await model.save(req.body.name,req.body.email,req.body.address);
    const newUser = new model(req.body)
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
    // try {
        
    // }
    // catch (err) {
    //     console.log(err);
    // }
});

exports.updateData = asyncCatch(async (req, res) => {
    
    const user = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }
    })
    // try {
        
    // }
    // catch (err) {
    //     res.status(404).json({
    //         status: 'failed',
    //         message: err
    //     })
    // }
});
exports.deleteData = asyncCatch(async (req, res) => {
    
    model.findByIdAndRemove(req.params.id)
    res.status(200).send('Data deleted successfully');
    
    // try {
       

    // }
    // catch (err) {
    //     console.log(err)
    //     res.status(500).send(err)

    // }
});