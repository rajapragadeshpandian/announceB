const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

router.get('/:feedbackId', (req, res) => {

    Feedback.find({ __change : req.params.feedbackId})
    .exec((err, feedback) => {
            console.log("$$$", feedback);
        if(err) {
            res.status(500).json({
                error : err
            });
        } else {
            if(feedback) {
                res.status(200).json({
                    message: "feedback returned sucessfully",
                    feedback : feedback
                });
            } else {
                res.status(404).json({
                    message: "feedback not found"
                });
            }
            
        }

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

    }).save((err,feedback) => {
        console.log("##", feedback);
            if(err) {
                res.status(500).json({
                    error : err
                });
            } else {
                    res.status(200).json({
                        message: "feedback successfully posted",
                        val : feedback
                    });
            }
    });

});

module.exports = router;