const express = require('express');
const  router = express.Router();
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');

const Account = require('../models/account');
const User = require('../models/users');

const requireLogin = require('../middlewares/requireLogin');

router.get('/', requireLogin,  (req, res, next) => {

                const {accId} = req.query;
                console.log(accId);
                Account.find({_id : accId})
                .find()
                .exec()
                .then((account) => {
                    res.status(200).json({
                        accountDetails : account
                    })
                    
                })
                .catch(next)

})

router.post('/invite', (req, res, next) => {

    const { email, accId, userType} = req.body;

                 function sendMail() {

                        sgMail.setApiKey(keys.sendGridKey);
                        console.log(req.body.email);
                        
                            const message = {};
                            message.to = req.body.email;
                            message.from = "pragadesh72@gmail.com";
                            message.subject = `Invite from AnnounceB as ${req.body.userType}`;
                            message.text = "Please click on below links to accept or decline the invite";
                            message.html = `
                            <p>Please click on below links to accept or decline the invite<p>
                            <div>
                            <a href="http://localhost:5000/account/invite/accept?email=${req.body.email}">Accept</a>
                            </div>
                            <div>
                            <a href="http://localhost:5000/account/invite/decline?email=${req.body.email}">Decline</a>
                            </div>
                            `;

                            sgMail.send(message)
                            .then(response => {
                                    res.status(200).json({
                                        response : response,
                                        email : email,
                                        userType : userType
                                    })
                            
                            })
                            .catch(next)

                    }

         function createNewUser(user) {

             if(user) {

                function checkaccount(acc) {
                    if(acc) {
                        res.status(200).json({
                         message : "user already  exist in this account"
                     });
                    } else {

                        let account = Account.updateOne(
                            {_id : accId},
                                {$addToSet : {
                                    users : {
                                    userType : userType,
                                    __user : user._id,
                                    email : user.identities[0].email
                                    }
                                }}
                            )
                            .exec()
                            .then((account) => account)
                            .catch(next);

                        return account;
                    }
                   
                }
               
                Account.findOne({
                    _id : accId,
                    "users.__user" : user._id
                })
                .exec()
                .then((acc) => checkaccount(acc))
                .then(() => sendMail())
                .catch(next)

             } else {

                function createAccount(user) {

                    let account = Account.updateOne(
                        {_id : accId},
                            {$addToSet : {
                                users : {
                                userType : userType,
                                __user : user._id,
                                email : user.identities[0].email
                                }
                            }}
                        )
                        .exec()
                        .then((account) => account)
                        .catch(next)
    
                    return account;
                }

                let newUser = new User({
                    identities : [{ email : email}]
                })
                .save()
                .then((user) => createAccount(user))
                .then((account) => sendMail())
                .catch(next)

             }

         }

        User.findOne({"identities.email" : email})
        .exec()
        .then((user) => createNewUser(user))
        .catch(next)

       
});

router.get('/invite/accept', (req, res, next) => {

        User.updateOne({"identities.email" : req.query.email},
                    { "$set" : {
                    "identities.$.verified" : true
                    }}
                    )
                    .exec()
                    .then(() => {
                        res.redirect(`/account/userdetails?email=${req.query.email}`)
                    })
                    .catch((err) => done(err))

});

router.get('/userdetails', (req, res, next) => {
    res.render('userDetails', {email : req.query.email || "prag@gmail.com"});
});

router.get('/invite/decline', (req, res, next) => {
res.send('user declined the request');
});

router.delete('/delete' , (req, res, next) => {

    const {userId, accId} = req.body;

            function deleteAccount() {

               let deletedAcc = Account.updateOne(
                   {_id : accId},
                    { $pull : {
                        users : {
                            __user : userId
                        }
                    }})
                    .exec()
                    .then((acc) => acc)
                    
                return deletedAcc;
            }

                function fetchAccount() {

                    let account = Account.findOne(
                        {_id : accId})
                    .exec()
                    .then(account => account)
    
                    return account;
                }

            

                User.deleteOne({_id : userId })
                .exec()
                .then(() => deleteAccount())
                .then(() => fetchAccount())
                .then((account) => {
                    res.status(200).json({
                        account : account
                    })

                })
                .catch(next)
});

router.post('/adhoc', (req, res, next) => {

    /*db.survey.find(
        { results: {
             $elemMatch: {
                  product: "xyz", 
                  score: { $gte: 8 } } } }
     )*/

    Account.find(
        { users : {
            $elemMatch : {
                    __user : "61b201b90e156d91428533a2",
                    userType : "Owner"
                 }
    }})
    .exec()
    .then((acc) => {
        res.status(200).json({
            acc : acc
        })
    })
    .catch(next)

            // User.updateOne(
            //     {"identities.email" : "rajapragadesh1994@gmail.com"},
            //     {$set : {
            //         name : "rajapragadesh.p"
            //     }}
            // )
            // .exec()
            // .then(() => {
            //     res.send("updated successfully")
            // })
});

module.exports = router;