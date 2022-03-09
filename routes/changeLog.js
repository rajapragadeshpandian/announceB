const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const changeLog = require('../models/changeLog');
const Customer = require('../models/customers');
const Account = require('../models/account');
const Feedback = require('../models/feedback');

const requireLogin = require('../middlewares/requireLogin');



// get changeLog
// req.user check in all routes
router.get('/', (req, res, next) => {

    //http://localhost:5000/changeLog?text=signup&&pageNo=2&&choice=next ==> sample req
    // no need for choice(prev or next) inc and dec pageno on client side  

    // regex { title : { "$regex" : req.query.text , $options : "i" }}
    // { $text : {$search : req.query.value }}
    const limit = 10;

    console.log(req.query.text);
    console.log(req.user);
    console.log(req.cookies);
    const userId = req.user ? req.user._id : "61cd520774e8839a71b0218e";
    const accId = req.cookies.accId || "61cd520874e8839a71b02191";
    const findText = req.query.text ? { $regex: req.query.text, $options: "i" } : null;
    const val = req.query.pageNo ? (req.query.pageNo - 1) * limit : 0;

    function getCount(changes) {

        const count = changeLog.getCount(accId, findText)
            .then((count) => count)
            .catch(next)

        return Promise.all([count, changes]);
    }

    /*function getAccounts(count, changes) {
            const accounts = Account.find({
                "users.__user" : userId
            })
            .select('users')
            .exec()
            .then((account) => account)
            .catch(next)

        return Promise.all([count, changes, accounts]);
    }*/
    // have to add accountId
    /*const changes =  changeLog.find({accId : accId, findText})
    .select('title category body _id disLike like')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()*/
    changeLog.getChanges(accId, findText, val, limit)
        .then((changes) => getCount(changes))
        .then(([count, changes]) => Account.findAccounts(userId, count, changes))
        .then(([count, changes, accounts]) => {
            console.log("$$$", changes);
            console.log("###", count);
            console.log(accounts);
            res.status(200).json({
                changeList: changes,
                count: count,
                accounts: accounts
            });
        })
        .catch(next);


});

//post changeLog
router.post('/', (req, res, next) => {

    console.log("$$$", req.body);
    const { title, body, category, accId, userId } = req.body;
    const findText = {};

    changeLog.createChanges(title, category, body, accId, userId)
        .then(() => changeLog.getChanges(accId, findText, 0, 10))
        //.then((changes) => getCount(changes))
        .then((changes) => {
            // if post is successful inc count on client side
            res.status(200).json({
                message: "changeLog successfully created",
                changeList: changes,
            });
        })
        .catch(next);
});

router.get('/sample', (req, res, next) => {
    console.log(req.cookies);
    res.status(200).json({
        title: "Appcoach announceB changelog",
        id: 1,
        category: "new",
        accId: req.cookies.accId
    })
})

router.get('/:changelogId', (req, res, next) => {

    const id = req.params.changelogId;
    console.log("####", req.params.changelogId);
    let val = 0;
    let limit = 5;
    // check after feedback creation
    function getFeedback(change) {
        const feedbacks = Feedback.getFeedback(change._id, val, limit)
            .then((feedback) => feedback)
            .catch(next)

        return Promise.all([feedbacks, change]);
    }

    function getCount(feedbacks, change) {

        const count = Feedback.count(change._id)
            .then((count) => count)
            .catch(next)

        return Promise.all([feedbacks, change, count]);
    }


    changeLog.getChangeById(id)
        .then((change) => getFeedback(change))
        .then(([feedbacks, change]) => getCount(feedbacks, change))
        .then(([feedbacks, change, count]) => {
            res.status(200).json({
                change: change,
                feedbacks: feedbacks,
                count: count
            });
        })
        .catch(next);
});

router.patch('/:changelogId', (req, res, next) => {
    console.log("changelog updated");
    const id = req.params.changelogId;
    const { title, category, body } = req.body;

    changeLog.updateChangelog(id, title, category, body)
        .then(() => changeLog.getChangeById(id))
        .then((change) => {

            res.status(200).json({
                message: "changelog updated successfully",
                change: change
            });

        })
        .catch(next);
});



router.delete('/:changelogId', (req, res, next) => {

    const limit = 5;
    const accId = req.body.accId;
    const findText = req.body.text ? { title: { $regex: req.query.text, $options: "i" } } : {};
    const val = req.body.pageNo ? (req.body.pageNo - 1) * limit : 0;

    const id = req.params.changelogId;
    // get changes after removing the change
    changeLog.removeChange(id)
        .then(() => changeLog.getChanges(accId, findText, val, limit))
        .then((changes) => {
            res.status(200).json({
                message: 'change deletd successfully',
                changes: changes
            });

        })
        .catch(next)

});

router.patch('/set/filter', (req, res, next) => {

    console.log("setfilter", req.body);
    const id = req.body.changeId;
    console.log(req.body.condition);

    changeLog.setFilter(id, req.body.condition)
        .then(() => changeLog.getChangeById(id))
        .then((change) => {

            res.status(200).json({
                message: "filter updated successfully",
                change: change
            });

        })
        .catch(next);

})

router.post('/adhoc', (req, res, next) => {


    changeLog.adhoc()
        .then(() => {
            res.send("updated successfully")
        })
        .catch(next)
})

router.get('/active/users', (req, res, next) => {

    let days = req.query.days;
    console.log(days);
    var date = new Date(Date.now());
    var yesterday = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    console.log("$$$", date);
    console.log("$$$", yesterday);

    console.log(req.query);

    changeLog.find({ updatedAt: { $gt: yesterday } })
        .exec()
        .then((changes) => {

            res.status(200).json({
                change: changes,
                len: changes.length

            });
        }).catch(next);
});





module.exports = router;

