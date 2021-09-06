const express = require('express');
const mongoose = require('mongoose');
const  router = express.Router();
const changeLog = require('../models/changeLog');

// get changeLog
router.get('/',(req, res) => {

    changeLog.find()
    .sort({ createdAt : -1 })
    .limit(2)
    .exec((err, changes) => {
        if(err) {
            res.status(500).json({
                error : err
            });
        } 
        else {
                if(changes.length > 0) {

                    const response = changes.map((item) => {
                            return {
                                id : item._id,
                                title : item.title,
                                category : item.category,
                                body : item.body
                            }
                    });
                    res.status(200).json({
                        changeList : response,
                        count : changes.length
                    });

                     } else {
                        res.status(404).json({
                            message : "changeLog not found"
                        });
                     }          
            }
    });

});


//post changeLog
router.post('/', (req, res) => {

    console.log("$$$", req.body);
    const  { title , body , category} = req.body;
    const changelog = new changeLog({

        title : title,
        category : category.split(','),
        body : body

    }).save((err, change) => {

        if(err) {
            res.status(500).json({
                error : err
            });
        } else {
            res.status(200).json({
                message : "changeLog successfully created",
                createdChange : {
                    id : change._id,
                    title : change.title,
                     category : change.category,
                    body : change.body
                }
            });
        }
      
    });  
});

router.get('/:changelogId',(req, res) => {

    const id = req.params.changelogId;
    changeLog.findById({ _id : id })
    .exec((err, change) => {

            if(err) {
                res.status(500).json({
                    error : err
                });
            } else {
                res.status(200).json({
                    message : "changeLog found",
                    change : {
                        id : change._id,
                        title : change.title,
                        category : change.category,
                        body : change.body
                    }
                });
            }

    });
});

router.patch('/:changelogId',(req, res) => {
    console.log("changelog updated");
    const id  = req.params.changelogId;
    const { title, category, body} = req.body;

    changeLog.findByIdAndUpdate({_id : id},
         { $set : {
            title : title,
            category : category.split(','),
            body : body
         }}
    ).exec((err, change) => {
        if(err) {
            res.status(500).json({
                error : err
            });
        } else {
            res.status(200).json({
                message : "changelog updated successfully"
            });
        }

    });

    
});

router.delete('/:changelogId', (req, res) => {

    const id = req.params.changelogId;
    changeLog.remove({ _id : id})
    .exec((err, change) => {

        if(err) {
            res.status(500).json({
                error : err
            });
        } else {
            res.status(200).json({
                message : 'chnage deletd successfully'
            });
        }

    });

});

router.get('/page/:pageNo', (req, res) => {
    console.log("$$$$","pagination");
    console.log("###", req.params.pageNo == "next");
    const limit = 2;
    const val  = (req.params.pageNo -1) * 2;
    console.log("$$$", val);
    changeLog.find()
    .sort({createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec((err, changes) => {

        if(err) {
            res.status(500).json({
                error : err
            })
        } else {
            if(changes.length > 0) {

                const response = changes.map((item) => {
                        return {
                                id : item._id,
                                title : item.title,
                                category : item.category,
                                body : item.body

                        }
                });

                    res.status(200).json({
                    message : "records returned  successfully",
                    changes : response,
                    count : changes.length
                });

            } else {
                res.status(404).json({
                    message : "records not found"
                });
            }
        }
    });
    
});

router.get('/page/:pageNo/:choice',(req, res) => {

    console.log("###", "prev or next page");
    let val;
    const limit = 2;
    const pageNo = req.params.pageNo;
    const choice = req.params.choice;
    if(choice === "next") {
        val = req.params.pageNo * limit;
    } else {
        val = (req.params.pageNo -2) * limit;
    }

    changeLog.find()
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec((err, changes) => {
        if(err) {
            res.status(500).json({
                error : err
            });
        } else {
            if(changes.length > 0) {
                const response = changes.map((item) => {
                    return {
                        id : item._id,
                        title : item.title,
                        category : item.category,
                        body : item.body
                    }
                });
                res.status(200).json({
                    message : "prev or next page",
                    value  : response
                });
            } else {
                res.status(404).json({
                    message : "changeLog not found"
                });
            }
            
        }

    });   

});

router.get('/unique/tags', (req, res) => {

    console.log("###", "uniqueTags");

    changeLog.aggregate([
        { $unwind : "$category"},
        { $group : { _id : "$category"}}

    ]).exec((err, tags) => {
            if (err) {
                res.status(500).json({
                    message : "tags not found"
                });
            } else {
                    res.status(200).json({
                        tags : tags
                    });
            }
    })


});

//pending unique tags

module.exports = router;

