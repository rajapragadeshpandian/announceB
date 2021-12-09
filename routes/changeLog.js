const express = require('express');
const mongoose = require('mongoose');
const  router = express.Router();
const changeLog = require('../models/changeLog');
const Customer = require('../models/customers');

const requireLogin = require('../middlewares/requireLogin');

// get changeLog
// req.user check in all routes
router.get('/', requireLogin,(req, res, next) => {

    //http://localhost:5000/changeLog?text=signup&&pageNo=2&&choice=next ==> sample req
// no need for choice(prev or next) inc and dec pageno on client side  

// regex { title : { "$regex" : req.query.text , $options : "i" }}
// { $text : {$search : req.query.value }}
    const limit = 3;
    
    console.log(req.query.value);
    console.log(req.user);
    const accId = req.query.accId;
    const findText = req.query.text ? { title : { $regex : req.query.text , $options : "i" }} : {};
     const val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;


    function fetchChanges(changes) {

        const count = changeLog.countDocuments(
            {accId : accId,findText}
        )
        .exec()
        .then((count) => count)

        return Promise.all([count, changes]);
    }
    // have to add accountId
        const changes =  changeLog.find({accId : accId, findText})
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
        
             
});

//post changeLog
router.post('/', (req, res, next) => {

    console.log("$$$", req.body);
    const  { title, body, category, accId} = req.body;

    const changelog = new changeLog({
        title : title,
        category : category.split().map((item) => item.trim()),
        body : body,
        accId : accId
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
    //accid has to be added
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

router.patch('/set/filter', (req, res, next) => {

    console.log("setfilter", req.body);
    const id = req.body.changeId;
    console.log(req.body.condition);
    
            changeLog.updateOne({ _id : id},
                        { $set :{
                            conditions : req.body.condition                 
                        } }
                    )
                    .exec()
                    .then((changes) => {

                        res.status(200).json({
                            message : "filter updated successfully"
                        });

                    })
                    .catch(next);
   
})

router.get('/active/users', (req, res, next) => {

    let days = req.query.days;
    console.log(days);
    var date = new Date(Date.now());
    var yesterday = new Date(date.getTime()- days*24*60*60*1000);
    console.log("$$$",date);
    console.log("$$$",yesterday);

    console.log(req.query);

    changeLog.find({updatedAt : { $gt : yesterday }})
    .exec()
    .then((changes) => {
    
        res.status(200).json({
            change: changes,
            len : changes.length

        });
    }).catch(next);
});



module.exports = router;

