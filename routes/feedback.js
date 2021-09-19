const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

router.get('/:changeLogId', (req, res) => {

    const limit = 3;
    const val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;

    Feedback.find({ __change : req.params.changeLogId})
    .select('_id title customer content __change')
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
    const {title, content, customer, changeId} = req.body;
    console.log("$$$", req.body);
    
    Feedback.findByIdAndUpdate({ _id : req.params.feedbackId },
    {
        $set : {
            title: title,
        content : content,
        customer : {
            name : customer.name,
            id : customer.id
        },
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