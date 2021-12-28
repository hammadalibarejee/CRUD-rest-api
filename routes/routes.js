const express = require('express');
const controller = require('./../controller/controller')
const app = require('./../app');

router = express.Router();

router
    .route('/api')
    .get(controller.getData)

    .post(controller.postData);


router
    .route('/api/:id')
    .put(controller.updateData)
    .delete(controller.deleteData);

module.exports = router; 