const express = require('express');
const controller = require('./../controller/controller');
const accountController= require ('./../controller/accountController');
const app = require('./../app');
var  router  = require('./../app');


router = express.Router();

router.post('/signup',accountController.signup);
router.post('/login',accountController.login);

router
    .route('/')
    .get(accountController.protect, controller.getData)
    .post(accountController.protect,controller.postData);


router
    .route('/:id')
    .put(accountController.protect,controller.updateData)
    .delete(accountController.protect,controller.deleteData);

module.exports = router; 