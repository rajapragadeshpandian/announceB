const express = require('express');
const mongoose = require('mongoose');
const  router = express.Router();
const changeLog = require('../models/changeLog');
const Customer = require('../models/customers');

// get changeLog
router.get('/',(req, res, next) => {

    //http://localhost:5000/changeLog?text=signup&&pageNo=2&&choice=next ==> sample req
// no need for choice(prev or next) inc and dec pageno on client side  

// regex { title : { "$regex" : req.query.text , $options : "i" }}
// { $text : {$search : req.query.value }}

   

    const limit = 3;
    
    console.log(req.query.value);
    const findText = req.query.text ? { title : { $regex : req.query.text , $options : "i" }} : {};
     const val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;


    function fetchChanges(changes) {

        const count = changeLog.countDocuments(findText)
        .exec()
        .then((count) => count)

        return Promise.all([count, changes]);
    }

        const changes =  changeLog.find(findText)
        .select('title category body _id disLike like')
        .sort({ createdAt : -1 })
        .skip(val)
        .limit(limit)
        .exec()
        .then((changes) => fetchChanges(changes))
        .then(([count, changes]) => {

            console.log(changes);
            res.status(200).json({
                changeList : changes,
                count : count
                 });
        })
        .catch(next);
        
        // const count = changeLog.countDocuments(findText)
        // .exec();

        // Promise.all([changes, count])
        // .then(([changes , count]) => {
        //     console.log("$$$$",changes);
        //     console.log("####", count);
        //         res.status(200).json({
        //             changeList : changes,
        //             count : count
        //         });
        // })
            
});

router.get('/widget', (req, res, next) => {


    console.log("widget query", req.query);

    const { name, accId, email} = req.query;

    //console.log("custdetails", name, accId, email);
    const custPlan = Object.fromEntries(
        Object.entries(req.query).slice(3)
    );

    //console.log(sliced);

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
                subscription : [custPlan]
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


//post changeLog
router.post('/', (req, res, next) => {

    console.log("$$$", req.body);
    const  { title , body , category} = req.body;

    const changelog = new changeLog({

        title : title,
        category : category.split(','),
        body : body
    })
    .save()
    .then((change) => {
// if post is successful inc count on client side
            res.status(200).json({
                message : "changeLog successfully created",
                createdChange : {
                    id : change._id,
                    title : change.title,
                     category : change.category,
                    body : change.body
                },

            });
    })
    .catch(next);
});

router.get('/:changelogId',(req, res, next) => {
    console.log("changeLogid");
    const id = req.params.changelogId;
    console.log("####", req.params.changelogId);
    changeLog.findById({_id : id})
    .select('title category body _id disLike like')
    .exec()
    .then((change) => {
                console.log("$$$$", change);
                res.status(200).json({
                    message : "changeLog found",
                    change : change
                });

    })
    .catch(next);

});

router.patch('/:changelogId',(req, res, next) => {
    console.log("changelog updated");
    const id  = req.params.changelogId;
    const { title, category, body} = req.body;

    changeLog.findByIdAndUpdate({_id : id},
         { $set : {
            title : title,
            category : category.split(','),
            body : body
         }}
    )
    .exec()
    .then((change) => {
        
            res.status(200).json({
                message : "changelog updated successfully"
            });

    })
    .catch(next);

    
});



router.delete('/:changelogId', (req, res, next) => {

    const id = req.params.changelogId;
    changeLog.remove({ _id : id})
    .exec()
    .then((change) => {

            res.status(200).json({
                message : 'change deletd successfully'
            });

    })
    .catch(next);

});


module.exports = router;

