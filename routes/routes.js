const express = require('express');
const controller = require('./../controller/controller');
const accountController= require ('./../controller/accountController');
// const app = require('./../app');
// var  router  = require('./../app');


router = express.Router();

router.post('/signup',accountController.signup);
router.post('/login',accountController.login);

router
    .route('/')
    .get(controller.getData)
    .post(controller.postData);


router
    .route('/:id')
    .put(controller.updateData)
    .delete(controller.deleteData);

module.exports = router; 