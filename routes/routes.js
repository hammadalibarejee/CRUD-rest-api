const express = require('express');
const controller = require('./../controller/controller');
const accountController= require ('./../controller/accountController');
const app = require('./../app');
var  router  = require('./../app');


router = express.Router();

router.post('/signup',accountController.signup);
router
    .route('/api')
    .get(controller.getData)
    .post(controller.postData);


router
    .route('/api/:id')
    .put(controller.updateData)
    .delete(controller.deleteData);

module.exports = router; 