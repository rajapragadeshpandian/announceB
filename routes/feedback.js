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

    }).catch((err) => {
        res.status(500).json({
            error : err
        });
    });

});

router.post('/', (req, res) => {

    console.log("feedback");

    const { contentTitle, content, customerName, customerType, changeId} = req.body;

    console.log("$$$", req.body );
    const feedback = new Feedback({

        contentTitle: contentTitle,
        content : content,
        customerName : customerName,
        customerType : customerType,
        __change : changeId,

    })
    .save()
    .then((feedback) => {
    
                    res.status(200).json({
                        message: "feedback successfully posted",
                        newFeedback : feedback
                    });

    }).catch((err) => {
        res.status(500).json({
            error : err
        });
    });

});


router.patch('/:feedbackId', (req, res) => {

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
                
    }).catch((err) => {
        res.status(500).json({
            error : err
        });
    });

});

router.delete("/:feedbackId", (req, res) => {

    console.log("###", "delete");
     
     Feedback.findByIdAndDelete({ _id : req.params.feedbackId})
     .exec()
     .then((feedback) => {
            res.status(200).json({
                message : "deleted successfully"
            });
     }).catch((err) => {
        res.status(500).json({
            error : err
        });
     });

});

module.exports = router;