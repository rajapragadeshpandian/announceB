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
   
    // filter['$or'] = conditions;

    // console.log("filter", filter);


    var customizedProps = "customizedProps." + req.query.property;
    var queryObj = {
    };
    queryObj[customizedProps] = req.query.value;
   // { 'customizedProps.rental': 'monthly', name : "light" }
    console.log("queryobj",queryObj);

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



router.post('/segment', (req, res,next) => {
let finalQuery;
var queryObj = {};
var splitCondition = req.body.data.filter((item,index,arr) => {
    
      return item.splitOperator;
});


var splitProperties = req.body.data.filter((item,index,arr) => {
    
    return !item.splitOperator;
});


var queryResults = splitProperties.map((data) => {
    var resultObj = {};
  
    //{name : { $eq : ram}}
     var queryCondition = data.filter((item) =>  {
            return item.condition;
     });

     var properties = data.filter((item) =>  {
            return !item.condition;
     });


    var queryProperties = properties.map((data) => {
         var propertyObj = {};
         var valueObj = {};
         valueObj[data.operator] = data.value;
         propertyObj[data.property] = valueObj;

         return propertyObj;
     });

     if(queryCondition.length >  0) {
        resultObj[queryCondition[0].condition] = queryProperties;
        return resultObj;
     }

     return queryProperties[0];
        // {   
        // $or : [{name : { $eq : ram}},{name : { $eq : prag}}]
        // }
});

console.log(queryResults[0]);


if(splitCondition.length > 0) {
    queryObj[splitCondition[0].splitOperator] = queryResults;
    finalQuery = queryObj;
} else {
    finalQuery = queryResults[0];
}


console.log(finalQuery);


// {
//     $and : [
//         {
//         $or : [{name : { $eq : ram}},{name : { $eq : prag}}]
//         },
//         {
//         $or : [{index : { $eq : 1}},{index : { $eq : 3}}]
//         }
        
//     ]
// } 
//{name : { $eq : ram}}

        Customer.find(finalQuery)
        .exec()
        .then((customer) => {  
            res.status(200).json({
                message : "customer details returned",
                customer : customer,
                len : customer.length
            });

        })
        .catch(next);

});

router.get(('/custprops'), (req, res, next) => {

    function filterPlan(customer) {

       var plans =  customer.map((item) => {
            const customProps = Object.fromEntries(
                Object.entries(item.customizedProps).slice(0,1)
            );
            
            return Object.keys(customProps);
        });

        return plans;
    }

    Customer.find({}, {customizedProps : 1})
    .exec()
    .then((customer) => {  
        
        var plan = filterPlan(customer);
        var filteredPlan = plan.filter((item) => {
                return item[0] == "type";
        })

        console.log(filteredPlan, filteredPlan.length > 0);
        res.status(200).json({
            message : "customer details returned"
        });

    })
    .catch(next);

});




module.exports = router;