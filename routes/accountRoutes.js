const express = require('express');
const  router = express.Router();
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');

const Account = require('../models/account');
const User = require('../models/users');

router.get('/', (req, res, next) => {

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

         function createNewUser(user) {

             if(user.length > 0) {
                 res.status(404).json({
                     error : "User allready exist"
                 })
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
                            <a href="http://localhost:5000/account/invite/decline">Decline</a>
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

                let newUser = new User({
                    identities : [{ email : email}]
                })
                .save()
                .then((user) => createAccount(user))
                .then((account) => sendMail())
                .catch(next)

             }

         }

        User.find({"identities.email" : email})
        .exec()
        .then((user) => createNewUser(user))
        .catch(next)

    /*sgMail.setApiKey(keys.sendGridKey);
 console.log(req.body.email);
 
    const message = {};
    message.to = "rajapragadeshpandian@gmail.com";
    message.from = "pragadesh72@gmail.com";
    message.subject = `Invite from AnnounceB as ${req.body.userType}`;
    message.text = "Please click on below links to accept or decline the invite";
    message.html = `
    <p>Please click on below links to accept or decline the invite<p>
    <div>
    <a href="http://localhost:5000/account/invite/accept?${req.body.email}">Accept</a>
    </div>
    <div>
    <a href="http://localhost:5000/account/invite/decline">Decline</a>
    </div>
    `;

    sgMail.send(message)
    .then(response => {
            res.status(200).json({
                response : response
            })
    
    })
    .catch(next);*/
       
});

router.get('/invite/accept', (req, res, next) => {
    console.log(req.query);
res.render('userDetails', {email : req.query.email || "prag@gmail.com"});
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
    

            Account.update({accName : "announceB"},
                {$pull : {
                    users : {
                    __user : "61adb9620fe7cbcabcc0982a"
                    }
                }}
            )
            .exec()
            .then(() => {
                res.send("updated successfully")
            })
});

module.exports = router;