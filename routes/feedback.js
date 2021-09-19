const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

router.get('/:changeLogId', (req, res) => {

    const limit = 1;
    let val;

    if(req.query.choice === "next") {
        val = req.query.pageNo * limit;
    } else if(req.query.choice === "prev") {
        val = (req.query.pageNo -2) * limit;
    } else {
        val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;
    }

    Feedback.find({ __change : req.params.changeLogId})
    .select('_id contentTitle customerName content customerType __change')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()
    .then((feedback) => {
        
            console.log("$$$", feedback);
                res.status(200).json({
                    message: "feedback returned sucessfully",
                    feedback : feedback
                });

    }).catch(next);

});

router.post('/', (req, res, next) => {

    console.log("feedback");

    const { title, content, customer, changeId} = req.body;

    console.log("$$$", req.body );
    const feedback = new Feedback({

        title: title,
        content : content,
        customer : {
            name : customer.name,
            id : customer.id
        },
        __change : changeId,

    })
    .save()
    .then((feedback) => {
    
                    res.status(200).json({
                        message: "feedback successfully posted",
                        newFeedback : feedback
                    });

    }).catch(next);

});


router.patch('/:feedbackId', (req, res, next) => {

    console.log("$$$", "feedback updated successfully");
    const { newContentTitle, newContent, newCustomerName, newCustomerType, changeId} = req.body;
    console.log("$$$", req.body);
    
    Feedback.findByIdAndUpdate({ _id : req.params.feedbackId },
    {
        $set : {
            contentTitle: newContentTitle,
        content : newContent,
        customerName : newCustomerName,
        customerType : newCustomerType,
        __change : changeId,
        }}
    )
    .exec()
    .then((feedback) => {

                res.status(200).json({
                    message : "feedback updated successfully"
                });
                
    }).catch(next);

});

router.delete("/:feedbackId", (req, res, next) => {

    console.log("###", "delete");
     
     Feedback.findByIdAndDelete({ _id : req.params.feedbackId})
     .exec()
     .then((feedback) => {
            res.status(200).json({
                message : "deleted successfully"
            });
     }).catch(next);

});

module.exports = router;