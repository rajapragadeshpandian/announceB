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


router.get('/widget', (req, res, next) => {


    console.log("widget query", req.query);

    const { name, accId, email} = req.query;

    //console.log("custdetails", name, accId, email);
    const customProps = Object.fromEntries(
        Object.entries(req.query).slice(3)
    );

//     function convert(props) {
//          var queryObj = {};

//         //  queryObj = {
//         //      plan : {plan : "starter"}
//         //  }
//         console.log("$$$", props);
//         var key = Object.keys(props);

//         const entries = Object.fromEntries(
//             Object.entries(props)
//         );
//         console.log("%%%", entries, entries[0]);
//         console.log("###", key, key.length);

//           let i;
//           for (i=0; i<key.length ; i++) {
//               var q1 = {};
//               q1[key[i]] = props[key[i]];
//               console.log("^^^",q1);
//                 console.log(key[i]);
//                 console.log(props[key[i]]);
//                  queryObj[key[i]] = q1;
//                 console.log(queryObj);
//           }
//           return queryObj;
//     }

//    const customProps1 =  convert(customProps);

//    console.log("&&&", customProps1);


    function widget() {

        console.log("widget function");
        const changes =  changeLog.find()
        .select('title category body _id disLike like')
        .sort({ createdAt : -1 })
        .limit(3)
        .exec()
        .then((change) => change)

        return changes;
    
    }

    Customer.findOne({email : email})
    .exec()
    .then((customer) => {

        if(!customer) {
            console.log("!!!","customer not exist");
            let customer = new Customer({
                name : name,
                email : email,
                customizedProps : customProps
            });
            return customer.save()
        } else {
            console.log("###", "customer exist");
            return customer;
        }

    })
    .then(customer => widget())
    .then((changes) => {
        console.log("changes", changes);
        res.status(200).json({
        changeList : changes
         });
    })
    .catch(next)
       
});


router.get('/filter', (req, res, next) => {

    console.log("filter");

    var value  = req.query.value;
    var property =  req.query.property;
    var customizedProps = "customizedProps." + property;
    console.log("customizedProps",customizedProps);
    var queryObj = {
    };
    queryObj[customizedProps] = value;
    console.log("###", queryObj);   

    Customer.find(queryObj)
    .exec()
    .then((customer) => {  
        console.log("$$$", customer);
        res.status(200).json({
            message : "customer details returned",
            customer : customer,
            len : customer.length
        });

    })
    .catch(next)
    //{"customizedProps.plan" : "starter"}


   // {"customizedProps.plan" : "starter"}  
   // {customizedProps : { rent: "starter"}
// let name = "name";
// let value = "vicky";

//    var queryObj = {};
//    queryObj[name] = value;
//    console.log(queryObj);

// var obj = {};
// obj[plan] = value;

// console.log(obj);
//{customizedProps : { $elemMatch : ff }}
});




module.exports = router;