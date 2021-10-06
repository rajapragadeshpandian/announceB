const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Customer = require('../models/customers');
const changeLog = require('../models/changeLog');


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

router.patch('/:changelogId', (req, res, next) => {

    const updateLikedPost = (likedPosts) => {

        console.log('###', likedPosts);

        const filteredPost = likedPosts.filter((post) => {
            console.log("$$$", post);
            return post.__change == req.params.changelogId
        })

        console.log("@@@", filteredPost);

        if(filteredPost.length > 0){
            console.log("filtered posts exist");

            Customer.updateOne({ _id : req.query.custId, "likedPosts.__change" : req.params.changelogId  },
                { $set : { 
                    "likedPosts.$.responded" : req.query.choice
                    }}
                    )
                    .exec()
                    .then((post) => {

                        let choice;
                        console.log(req.query.choice);
                        if(req.query.choice == "like") {
                            choice = { like : 1, dislike  : -1}
                        } else if(req.query.choice == "dislike") {
                            choice = { like : -1, dislike : 1 }
                        } else if( req.query.choice == "unlike") {
                            choice = { like : -1}
                        } else {
                            choice = { dislike : -1}
                        }
                        
                       
                        changeLog.updateOne({_id : req.params.changelogId},
                            { $inc : choice })
                               .exec()
                               .then((changes) => {
                                   res.status(200).json({
                                       message : "updated successfully"
                                   })
                               })
                               .catch(next)
                        

                    })
                    .catch(next)
        } else {

            Customer.updateOne({ _id : req.query.custId },
                { $push : { 
                    likedPosts : {
                        __change  : req.params.changelogId,
                        responded : req.query.choice
                        } 
                    }}
                    )
                    .exec()
                    .then((post) => {
                         
                        let choice;
                        console.log(req.query.choice);
                        if(req.query.choice == "like") {
                            choice = { like : 1 }
                        } else if(req.query.choice == "dislike") {
                            choice = { dislike : 1 }
                        }

                        console.log("%%%", choice, req.params.changelogId);

                        changeLog.updateOne({_id : req.params.changelogId},
                         { $inc : choice })
                            .exec()
                            .then((changes) => {
                                res.status(200).json({
                                    message : "updated successfully"
                                })
                            })
                            .catch(next)

                            
                    })
                    .catch(next);
        
        }
    }


    Customer.findById({ _id :req.query.custId })
    .exec()
    .then((customer) => {
        console.log(customer);
        const likedPosts = customer.likedPosts;
        updateLikedPost(likedPosts);
    })
    .catch(next);


   

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