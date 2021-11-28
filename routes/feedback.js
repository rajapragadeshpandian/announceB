
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const Customer = require('../models/customers');

router.get('/', (req, res, next) => {

    const limit = 3;
    const val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;
    const { customerId = null } = req.query;

    // count code has to be added for pagination

    function getCustomerId(feedback) {

            if(customerId) {
                 let custId =  Customer.findOne(
                     {_id : customerId}
                    )
                .select('_id')
                .exec()
                .then((id) => id)
        
            return Promise.all([custId, feedback]);
            } 

      return Promise.all([null, feedback]);
            
    }

    Feedback.find({ __change : req.query.changeLogId})
    .select('_id title content __change')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()
    .then((feedback) => getCustomerId(feedback))
    .then(([custId, feedback]) => {
        
            console.log("$$$", feedback);
                res.status(200).json({
                    message: "feedback returned sucessfully",
                    feedback : feedback,
                    customerId : custId
                });

    }).catch(next);
    
});

router.post('/', (req, res, next) => {

    console.log("feedback");

    const { title, content, customerId, changeId} = req.body;

    function createFeedback(customer) {

        console.log(customer);

                const feedback = new Feedback({

                        title: title,
                        content : content,
                        __change : changeId,
                        __customer : {
                            name : customer.name,
                            id : customer._id
                        }
                })
                .save()
                .then((feedback) =>  feedback)

         return feedback;
    }

        Customer.findOne({_id : customerId})
        .select('_id name')
        .exec()
        .then((customer) => createFeedback(customer))
        .then((feedback) =>  {
            res.redirect(`/feedback?changeLogId=${changeId}&&customerId=${customerId}`);
        })
        .catch(next)
                                              
});


router.patch('/', (req, res, next) => {

    console.log("$$$", "feedback updated successfully");
    const {title, content, changeId, feedbackId, customerId} = req.body;
    console.log("$$$", req.body);
    
    Feedback.findByIdAndUpdate({ _id : feedbackId },
    {
        $set : {
            title: title,
            content : content
        }}
    )
    .exec()
    .then(() => {

        res.redirect(`/feedback?changeLogId=${changeId}&&customerId=${customerId}`);
    })
    .catch(next);

});

router.delete("/", (req, res, next) => {

    const { changeId, feedbackId, customerId} = req.body;
     
     Feedback.findByIdAndDelete({ _id : feedbackId})
     .exec()
     .then(() => {
        res.redirect(`/feedback?changeLogId=${changeId}&&customerId=${customerId}`);
     })
     .catch(next);

});




module.exports = router;