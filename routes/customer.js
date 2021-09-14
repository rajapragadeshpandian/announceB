const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Customer = require('../models/customers');


router.get('/', (req, res) => {

    res.status(200).json({
        message : "customer details returned"
    });
});

router.post('/', (req, res) => {
    res.status(200).json({
        message : "customer created successfully"
    });
});


module.exports = router;