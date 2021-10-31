const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Customer = require('../models/customers');
const changeLog = require('../models/changeLog');
const Segment = require('../models/segments');


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

    function fetchUpdatedProps() {


        let updatedProps = Customer.findOne({email : email})
        .select('customizedProps')
        .exec()
        .then((customer) =>  customer)

        return updatedProps;
    }

    function widget(updatedProps) {

        const newProps = updatedProps.customizedProps;
        console.log("$$$", updatedProps.customizedProps);
        // find the segments in which the customer is associated with email
        // return the segments in array
        // frame an (or) condition and get the relevant changes

        var keys = Object.keys(newProps);
        console.log(keys);

        var properties = keys.map((item) => {
            let obj = {};
            let property = "conditions." + item;
            obj[property] = newProps[item]
            return obj;
        });
        var queryObj = {};
        queryObj['$or'] = properties;

        console.log(queryObj);

        //let custId = customer._id ? {__customers : customer._id} : {}; 
        const changes =  changeLog.find(queryObj)
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
            

            let customer = Customer.updateOne({ email : email}, 
            { $set : {
                customizedProps : customProps
            }})
            .exec()
            .then((customer) => customer)

            return customer;
        }

    })
    .then((customer) => fetchUpdatedProps())
    .then((updatedProps) => widget(updatedProps))
    .then((changes) => {
        res.status(200).json({
        changeList : changes
         });
    })
    .catch(next)
       
});


router.post('/createSegment', (req, res, next) => {
   

    const { title, condition} = req.body;

    function fetchCustomers(segment) {

        const customers = Customer.find(segment.condition)
            .exec()
            .then((customers) => customers)
        
        return Promise.all([segment, customers]);
    }

    Segment.find({ title : title})
        .exec()
        .then((segments) => {  

            if(segments.length > 0) {
                return res.status(200).json({
                    message : "Segment Name already exist"
                });
            }
            const segment = new Segment({
                title : title,
                condition : condition
            });

            return segment.save();

        })
        .then((segment) => fetchCustomers(segment))
        .then(([segment, customers]) => {

            console.log("$$$", segment, customers);
            res.status(200).json({
                message: "segment created" ,
                title : segment.title,
                id : segment._id,
                customers : customers
            });
        })
        .catch(next);

   

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


router.get('/segment/:segmentId', (req, res, next) => {

    const {segmentId} = req.params;

    function fetchCustomers(segment) {

        const customers = Customer.find(segment.condition)
            .exec()
            .then((customers) => customers)
        
        return customers;
    }
    
    Segment.findById({ _id : segmentId})
    .exec()
    .then((segment) => fetchCustomers(segment))
    .then((customers) => {
        console.log("$$$", customers);
            res.status(200).json({
                message: "customers returned successfully",
                customers : customers
            });
    })
    .catch(next);
   
});

router.patch('/segment/:segmentId', (req, res, next) => {

    console.log("segment updated");
    const {segmentId} = req.params;
    const { title, condition} = req.body;

    Segment.findByIdAndUpdate({ _id : segmentId},
        { $set : {
           title : title,
           condition : condition
        }}
   )
   .exec()
   .then((change) => {
       
           res.status(200).json({
               message : "Segment updated successfully"
           });

   })
   .catch(next);

})

router.delete('/segment/:segmentId', (req, res, next) => {

    const {segmentId} = req.params;

    Segment.findByIdAndDelete({_id : segmentId})
    .exec()
    .then((segment) => {
        res.status(200).json({
            message : "segment deleted successfully"
        });
    })
    .catch(next);

})



router.post('/segment', (req, res,next) => {

    console.log("$$$", req.body);

    // var customizedProps = "customizedProps." + req.query.property;
    // var queryObj = {
    // };
    // queryObj[customizedProps] = req.query.value;
   // { 'customizedProps.rental': 'monthly', name : "light" }
    
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

router.post('/filter', (req, res, next) => {

    const id = req.body.changeId;
    const condition = req.body.condition ? req.body.condition : {};

    function updateChangeLog(customer) {

            let customers = customer.map((item) => {
                 return item['_id'];
            });

            console.log("$$$", customers);
            console.log("$$$", id);

             let change = changeLog.updateOne({_id : id},
                { $set : {
                    __customers : customers
                }})
                .exec()
                .then((data) => data)
 
         return change;
    }
     
    
        Customer.find(condition)
        .select('_id')
        .exec()
        .then((customer) => updateChangeLog(customer))
        .then((data) => {
            res.status(200).json({
                message : "changeLog Upated successfully"
            })
        })
        .catch(next);
})

router.get('/custprops', (req, res, next) => {

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