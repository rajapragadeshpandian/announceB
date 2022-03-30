
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const Customer = require('../models/customers');

router.get('/', (req, res, next) => {

    const limit = 3;
    const val = req.query.pageNo ? (req.query.pageNo - 1) * limit : 0;
    //const { customerId = null } = req.query;

    // count code has to be added for pagination

    Feedback.getFeedbackById(req.query.changeLogId, val, limit)
        .then((feedback) => {
            res.status(200).json({
                message: "feedback returned sucessfully",
                feedback: feedback
            });
        })
        .catch(next);

});

router.post('/', (req, res, next) => {

    console.log("feedback");

    const { title, content, customerId, changeId } = req.body;

    // inc count on post on client side
    Customer.findCustomerById(customerId)
        .then((customer) => Feedback.createFeedback(title, content, changeId, customer))
        .then(() => Feedback.getFeedbackById(changeId, 0, 3))
        .then((feedback) => {
            res.status(200).json({
                feedback: feedback,
                customerId: customerId
            });
        })
        .catch(next)
});


router.patch('/:feedbackId', (req, res, next) => {

    const { title, content } = req.body;
    const { feedbackId } = req.params;
    console.log("$$$", req.body);

    Feedback.updateFeedback(feedbackId, title, content)
        //.then(() => Feedback.getFeedbackById(feedbackId))
        .then(() => {
            res.status(200).json({
                title: title,
                content: content,
                feedbackId: feedbackId
            });
        })
        .catch(next)

});

router.delete("/:feedbackId", (req, res, next) => {

    const { changeId, val, limit } = req.body;
    const { feedbackId } = req.params;

    Feedback.deleteFeedback(feedbackId)
        .then(() => Feedback.getFeedbackById(changeId, val, limit))
        .then((feedback) => {
            res.status(200).json({
                feedback: feedback
            });
        })
        .catch(next);

});

module.exports = router;