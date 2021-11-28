const express = require('express');
const router = express.Router();
const Customer = require('../models/customers');
const Feedback = require('../models/feedback');
const changeLog = require('../models/changeLog');

/*const renameKeys = (obj) =>
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

router.get('/', (req, res, next) => {

    const limit = 3;

   //`http://localhost:5000/customer/widget
   //?accId=${accId}&&email=${customer.email}
   //&&text=signup&&pageNo=2`
   // for prev and next button also we will send page no  in query param


    const {email, accId} = req.query;

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
      //  {"$and" : [findText, condition]}

      function fetchCount(changes) {
        console.log("$$$", changes);
                const count = changeLog.countDocuments(
                    {"$and":[
                        condition,
                        findText
                    ]}
                )
                .exec()
                .then((count) => count)

        return Promise.all([count, changes]);
    }
       
             const changes =  changeLog.find(
                    {"$and":[
                        condition,
                        findText
                    ]}
                )
                .select('title category body _id disLike like')
                .sort({ createdAt : -1 })
                .skip(val)
                .limit(limit)
                .exec()
                .then((changes) => fetchCount(changes))
                .then(([count, changes]) => {
                    return {changes : changes, count: count};
                })

        return changes;
    
    }


             changeLog.find({accId : accId})
            .select('_id conditions')
            .exec()
            .then((changes) => filterChangeLog(changes))
            .then((IdList) => fetchChangeLog(IdList))
            .then((changes) => {
                res.status(200).json({
                    changeList : changes,
                    email : req.query.email
                 });
            })
            .catch(next)

});*/


router.get('/:changelogId',(req, res, next) => {

    console.log("changeLogid");

    //http://localhost:5000/widget/61921768b6050a01c7669e99?
    //custId=6192180fe506a2e199e0c4e7

    console.log(req.cookies);
    const id = req.params.changelogId;
    const custId = req.query.custId;
    console.log(custId);
    const email = req.query;
    const limit  = 3;
    const val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;
    console.log("####", req.params.changelogId);

    function getFeedbacks(change) {
        
        console.log(change);

                const feedbacks = Feedback.find(
                    {__change : change._id}
                )
                .sort({ createdAt : -1 })
                .skip(val)
                .limit(limit)
                .exec()
                .then((data) => data)

        return Promise.all([feedbacks,change]);

    }

    function getFeedbackCount(feedbacks,change) {
        console.log(feedbacks);
        console.log(change);

        const count = Feedback.countDocuments({__change : change._id})
        .exec()
        .then((count) => count)

        return Promise.all([feedbacks, change,count]);
    }

    function fetchCustomerDetails(feedbacks, change,count) {

        let customer = Customer.findOne(
            {_id : custId}
        )
        .select('dislikedPosts likedPosts')
        .exec()
        .then((customer) => customer)

        return Promise.all([feedbacks, change,count, customer]);
    }


    changeLog.findById({_id : id})
    .select('title category body _id disLike like')
    .exec()
    .then((change) => getFeedbacks(change))
    .then(([feedbacks,change]) => getFeedbackCount(feedbacks,change))
    .then(([feedbacks, change,count]) => fetchCustomerDetails(feedbacks, change,count))
    .then(([feedbacks, change,count,customer]) => {
        // return customer details along with it to populate 
        // liked and dislikes posts
                res.status(200).json({
                    message : "changeLog found",
                    feedbacks : feedbacks,
                    change : change,
                    feedbackCount : count,
                    customer : customer
                });

    })
    .catch(next);// next(err)

});


router.get('/likedislike/count', (req, res, next) => {
console.log(req.cookies);

    //http://localhost:5000/widget/likedislike/count?
    //email=steve@gmail.com&&accId=announceB&&changelogId=61921768b6050a01c7669e99&&choice=like

    function updateCustomerAndCount(customer) {

        console.log(customer);
        let condition; 
        let choice;
        
        if(customer.length > 0) {

            if(req.query.choice == "like") {

                let likedPosts =  customer[0].likedPosts.concat(req.query.changelogId);
                let dislikedPosts =  customer[0].dislikedPosts.filter((item) => {
                    return item !== req.query.changelogId;
                })
                condition = { $set : {likedPosts : likedPosts, dislikedPosts : dislikedPosts}};
                choice = { like : 1, dislike  : -1};

            } else if(req.query.choice == "dislike") {

                let dislikedPosts =  customer[0].dislikedPosts.concat(req.query.changelogId);
                let likedPosts =  customer[0].likedPosts.filter((item) => {
                    return item !== req.query.changelogId;
                })
                condition = { $set : {likedPosts : likedPosts, dislikedPosts : dislikedPosts}};
                choice = { like : -1, dislike  : 1};
            }
            else if(req.query.choice == "removeLike" ) {

                condition = { $pull : { likedPosts : req.query.changelogId}};
                choice = { like : -1};

            } else if(req.query.choice == "removeDislike") {

                condition = { $pull : { dislikedPosts : req.query.changelogId}};
                choice = { dislike : -1};

            }

        } else {

            if(req.query.choice == "like") {
                condition = { $addToSet : { likedPosts : req.query.changelogId}};
                choice = { like : 1 };
            } else if(req.query.choice == "dislike") {
                condition = { $addToSet : { dislikedPosts : req.query.changelogId}};
                choice = { dislike : 1 };
            }

        }
        console.log(condition);

        function updateChangeLog() {

                let change =   changeLog.updateOne(
                    {_id : req.query.changelogId },
                    { $inc : choice }
                )
                .exec()
                .then((data) =>  data)
                
            return change;
        }

            let result =  Customer.updateOne(
                {_id : req.query.custId},
                condition
            )
            .exec()
            .then(() =>  updateChangeLog())
            .then((data) =>  data)

return result;
    }

            function getCount() {

                let count = changeLog.find(
                    {_id : req.query.changelogId}
                )
                .select('like dislike')
                .exec()
                .then((result) => result )

            return count;
            }

            function fetchCustomer(results) {

                let updatedCustomer = Customer.find({
                    _id : req.query.custId
                })
                .exec()
                .then((customer) =>  customer)

                return Promise.all([results,updatedCustomer]);
            }

    Customer.find({
        "$and" : [
            { _id : req.query.custId },
            {"$or" : [
                {likedPosts : req.query.changelogId },
                {dislikedPosts : req.query.changelogId }]
             }
        ]
     })
    .exec()
    .then((customer) => updateCustomerAndCount(customer))
    .then(() =>  getCount())
    .then((results) => fetchCustomer(results))
    .then(([results,updatedCustomer]) => {

        res.status(200).json({
            message : "updated successfully",
            results : results,
            customer : updatedCustomer
        });
    })
    .catch(next);  

});
//6192180fe506a2e199e0c4e7
// db.changeLogNew.update(
 //   { "_id" : ObjectId("6184c54c724cdea4f7ce9347")},
 //{ "$addToSet" : { post : "97909122", category : "bug1" }} )
module.exports = router;