const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Customer = require('../models/customers');


router.get('/', (req, res, next) => {


    Customer.find()
    .exec()
    .then((customer) => {
        
        res.status(200).json({
            message : "customer details returned",
            customer : customer
        });

    })
    .catch(next)

   
});

router.post('/', (req, res, next) => {

    console.log("$$$$", req.body);
    const { name, type, email} = req.body;
    const customer = new Customer({
        name : name,
        type : type,
        email : email
    })
    .save()
    .then((customer) => {
        res.status(200).json({
            message : "customer created successfully",
            customer : customer
        });
    })
    .catch(next);
  
});

router.patch('/:changelogId/:choice', (req, res, next) => {

    res.status(200).json({
        message: "like updated for change",
        changelogId : req.params.changelogId,
        choice : req.params.choice,
        custId : req.query.custId
    });

});

router.delete('/:customerId', (req, res, next) => {

        const id = req.params.customerId;
        Customer.findByIdAndDelete({_id :id })
        .exec()
        .then((customer) => {
            res.status(200).json({
                message : "customer deleted successfully"
            });
        })
        .catch(next);
       
});


module.exports = router;