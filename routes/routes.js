const express = require('express');
const controller = require('./../controller/controller')
const app = require('./../app');

router = express.Router();

router
    .route('/')
    .get(controller.getData)
    .post(controller.postData);

// router
//     .route('/')
    // .get(controller.getData);

module.exports = router; 