const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Customer = require('../models/customers');
const changeLog = require('../models/changeLog');
const Segment = require('../models/segments');
const Feedback = require('../models/feedback');


// router.patch('/set/changes',(req, res, next) => {
//     console.log("dhjaksdas")
    
//     Customer.update({}, 
//     {$set : {
//         __changes : []
//     }})
//     .exec()
//     .then(() => {
//         res.send("chnages updated successfully");
//     })
//     .catch(next);

// });

        const renameKeys = (obj) =>
                Object.keys(obj).reduce(
                (acc, key) => ({
                    ...acc,
                    ...{ ["$"+key]: obj[key] }
                }),
                {}
            );


        function keyChange(condition) {

            if(condition == null) {
                return {};
            }
      
            let queryObj =  Object.keys(condition).map((item) => {
    
                 
            if(item == "and" || item == "or") {
                 let outerCondition = renameKeys(condition);
       
                    var innerQuery =  Object.keys(outerCondition).map((item) => {
                         
                         var innerCondition = outerCondition[item].map((item) => {
                             
                             let innerProp = Object.keys(item).map((data) => {
                                 console.log("$$",item);
                                 console.log("$$$",data);
                                 if(data == "and" || data == "or") {
                                    var properties = renameKeys(item);
                               
                                        let innerProperties = Object.keys(properties).map((item) => {
                                       
                            
                                               var props = properties[item].map((item) => {
                                                   let keys = Object.keys(item);
                                                   let val = renameKeys(item[keys[0]]);
                                                   item[keys[0]] = val;
                                                   return item;
                                                   
                                               });
                                               properties[item] = props;
                                               //console.log(props);
                                               //console.log("$$$",properties);
                                               return properties;
                                               
                                           
                                        });
                                        
                                            return innerProperties[0];
                                 } else {
                        
                                    const keys = Object.keys(item);
                                     var val = renameKeys(item[keys[0]]);
                                     item[keys[0]] = val; 
                                     return item;

                                 }

                             });
                              
                        console.log(innerProp[0]);
                         return innerProp[0];
                             
                         });
                         console.log("####",innerCondition);
                        
                     return innerCondition;
                         
                     });
                     outerCondition["$"+item] = innerQuery[0];
                     console.log(outerCondition);
        
                     return outerCondition;
                 } else {
                     console.log("else part");
                      const keys = Object.keys(condition);
                       var val = renameKeys(condition[keys[0]]);
                       condition[keys[0]] = val; 
                       return condition;
                 }
                
             });
            console.log("###",queryObj);
           return queryObj[0];
             
         }



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

    console.log(req.query);
    const limit = 3;
    const {accId, id} = req.query;

    const findText = req.query.text ? { title : { $regex : req.query.text , $options : "i" }} : {};
     const val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;
    console.log(findText);

    function filterChangeLog(data) {

        var results =  data.map((item) => {
            var properties = keyChange(item.conditions);
            return {condition : properties, id : item._id}
        });

        let updatedProps = results.map((item) => {
    
                let customer = Customer.findOne(
                    { "$and" :
                        [
                            {_id : id},
                            item.condition
                        ]
                    })
                    .exec()
                    .then((customer) => {
                        if(!customer) {
                            return;
                        } else {
                            return item.id;
                        }
                    });
                    
              return customer;
        });

     return Promise.all(updatedProps);
    }

    function fetchChangeLog(id) {
    
            let queryObj = {};

            let changeId = id;
            let filteredId = changeId.filter((item) => {
                if(item) {
                    return item;
                }
            });
            let updatedCondition  =  filteredId.map((item) => {
                return  { _id : item }
            });
        
            queryObj["$or"] = updatedCondition;

            let condition = filteredId.length > 0 ? queryObj : {};
            console.log(queryObj);

            // {"$and":[
            //     condition,
            //     findText
            // ]}
       // should come here
            const changes =  changeLog.find(condition)
            .select('title category body _id disLike like')
            .sort({ createdAt : -1 })
            .skip(val)
            .limit(limit)
            .exec()
            .then((change) => {
                return change;
            })

        return changes;
    
    }

         changeLog.find({accId : accId})
            .select('_id conditions')
            .exec()
            .then((result) => filterChangeLog(result))
            .then((IdList) => fetchChangeLog(IdList))
            .then((changes) => {
                res.cookie("custId", req.query.id);
                res.status(200).json({
                    changeList : changes
                 });
            })  
            .catch(next);

    
})

router.get('/identify', (req, res, next) => {

    console.log("widget query", req.query);
   

    const { name, accId, email} = req.query;

    const customProps = Object.fromEntries(
        Object.entries(req.query).slice(3)
    );

    function getCustomer() {

            let customer = Customer.findOne({email : email, accId : accId})
            .exec()
            .then((customer) =>  customer)

        return customer;
    }

    Customer.findOne({email : email, accId : accId})
    .exec()
    .then((customer) => {

        if(!customer) {
            console.log("!!!","customer not exist");
            let customer = new Customer({
                accId : accId,
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
    .then(() => getCustomer())
    .then((customer) => {
        res.status(200).json({
            customer : customer
         });
    })
    .catch(next)
    


})


/*router.get('/track', (req, res, next) => {


    console.log("widget query", req.query);

    const { name, accId, email} = req.query;

    //console.log("custdetails", name, accId, email);
    const customProps = Object.fromEntries(
        Object.entries(req.query).slice(3)
    );

        function getConditions() {

            //let accId = req.query.accId;
            const conditions =  changeLog.find({accId : accId})
            .select('_id conditions')
            .exec()
            .then((changes) => {
                return changes;
            })

            return conditions;
        }

    function filterChangeLog(data) {

        var results =  data.map((item) => {
            var properties = keyChange(item.conditions);
            return {condition : properties, id : item._id}
        });

        let updatedProps = results.map((item) => {
    
                let customer = Customer.findOne(
                    { "$and" :
                        [
                            {accId: accId},
                            {email : email},
                            item.condition
                        ]
                    })
                    .exec()
                    .then((customer) => {
                        if(!customer) {
                            return;
                        } else {
                            return item.id;
                        }
                    });
                    
             return customer;
    });

     return Promise.all(updatedProps);


    }

    function fetchChangeLog(id) {
    
        let queryObj = {};

         let changeId = id;
         let filteredId = changeId.filter((item) => {
             if(item) {
                 return item;
             }
         });
        let updatedCondition  =  filteredId.map((item) => {
            return  { _id : item }
        });
    
        queryObj["$or"] = updatedCondition;

        let condition = filteredId.length > 0 ? queryObj : {};
        console.log(queryObj);
       
        const changes =  changeLog.find(condition)
        .select('title category body _id disLike like')
        .sort({ createdAt : -1 })
        .limit(3)
        .exec()
        .then((change) => {
            return change;
        })

        return changes;
    
    }



    Customer.findOne({email : email, accId : accId})
    .exec()
    .then((customer) => {

        if(!customer) {
            console.log("!!!","customer not exist");
            let customer = new Customer({
                accId : accId,
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
    .then(() => getConditions())
    .then((result) => filterChangeLog(result))
    .then((IdList) => fetchChangeLog(IdList))
    .then((changes) => {
        res.status(200).json({
            changeList : changes
         });
    })
    .catch(next)
       
});*/


router.post('/createSegment', (req, res, next) => {
   

    const { title, condition} = req.body;

    console.log(condition);
    
    function fetchCustomers(segment) {

        console.log("senemt", segment);

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


         var Condition = keyChange(segment.condition);

        const customers = Customer.find(Condition)
            .exec()
            .then((customers) => customers)
        
        return customers;
    }
    
    Segment.findById({ _id : segmentId})
    .exec()
    .then((segment) => fetchCustomers(segment))
    .then((customers) => {
            res.status(200).json({
                message: "customers returned successfully",
                customers : customers,
                length : customers.length
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

});

router.get('/adhoc', (req, res, next) => {

        let name = "pragadesh";

        changeLog.updateMany({},
            { $set : {
                accId : "announceB"
            }})
            .exec()
            .then((customer) => {
                res.send("updated successfully");
            })
            .catch(next);
    
    });



/*router.post('/segment', (req, res,next) => {

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

router.patch('/change/update',(req, res, next) =>  {
    console.log("change update");

    var arr = ["new", "fix", "bug", "new", "impeovr", "bug"];

    arr.map((item) => {
        Customer.updateOne({"$and":[
            {_id : "616009481b01a100dab5ff67"},
            {name : "jill"}
        ]},
        {$addToSet : {
            __changes : item
        }}
    ).exec()
    .then(() => {
        res.send("updated successfully");
    })
    .catch(next);

    });


});*/





module.exports = router;