const express = require('express');
const mongoose = require('mongoose');
const  router = express.Router();
const changeLog = require('../models/changeLog');

// get changeLog
router.get('/',(req, res) => {

    //http://localhost:5000/changeLog?value=signup&&pageNo=2&&choice=next ==> sample req

    const limit = 3;
    let val;
    console.log(req.query.value);
    let findText = req.query.value ? { $text : {$search : req.query.value }} : {};
    if(req.query.choice === "next") {
        console.log("next");
        val = req.query.pageNo * limit;
    } else if(req.query.choice === "prev") {
        console.log("prev");
        val = (req.query.pageNo -2) * limit;
    } else {
        val  = req.query.pageNo ? (req.query.pageNo -1) * limit : 0;
    }

    console.log("$$$$",val);

    console.log("####",findText);

    changeLog.find(findText)
    .select('title category body _id')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()
    .then((changes) => {
        console.log("$$$$$",findText);
        let count;
        changeLog.find(findText)
        .count()
        .exec()
        .then((items) => {

            const response = changes.map((item) => {
                return {
                    id : item._id,
                    title : item.title,
                    category : item.category,
                    body : item.body,
                }
        });

        res.status(200).json({
            changeList : response,
            count : items
        });

        }).catch((err) => {
            res.status(500).json({
                error : err
            });
        });

    })
    .catch((err) => {
        res.status(500).json({
            error : err
        });
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
    })
    .save()
    .then((change) => {

        let count;
        changeLog.find({},{_id : 1,title : 1,category : 1,body : 1})
        .count()
        .exec()
        .then((item) => {

            res.status(200).json({
                message : "changeLog successfully created",
                createdChange : {
                    id : change._id,
                    title : change.title,
                     category : change.category,
                    body : change.body,
                    count : item
                },

            });

        }).catch((err) => {
            res.status(500).json({
                error : err
            });
        });
            
    })
    .catch((err) => {
        res.status(500).json({
            error : err
        });
    });
});

router.get('/:changelogId',(req, res) => {
    console.log("changeLogid");
    const id = req.params.changelogId;
    console.log("####", req.params.changelogId);
    changeLog.findById({_id : id})
    .exec()
    .then((change) => {
                console.log("$$$$", change);
                res.status(200).json({
                    message : "changeLog found",
                    change : {
                        id : change._id,
                        title : change.title,
                        category : change.category,
                        body : change.body
                    }
                });

    })
    .catch((err) => {
            res.status(500).json({
            error : "changeLog not foound"
        });
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
    )
    .exec()
    .then((change) => {
        
            res.status(200).json({
                message : "changelog updated successfully"
            });

    })
    .catch((err) => {
        res.status(500).json({
            error : err
        })
    });

    
});



router.delete('/:changelogId', (req, res) => {

    const id = req.params.changelogId;
    changeLog.remove({ _id : id})
    .exec()
    .then((change) => {

            res.status(200).json({
                message : 'change deletd successfully'
            });

    })
    .catch((err) => {
        res.status(500).json({
            error : err
        });
    });

});


module.exports = router;

