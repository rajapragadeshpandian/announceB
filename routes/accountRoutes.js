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

    sgMail.setApiKey(keys.sendGridKey);
 console.log(req.body.email);
 
    const message = {};
    message.to = "rajapragadesh1994@gmaail.com";
    message.from = "rajapragadeshpandian@gmail.com";
    message.subject = "Invite from AnnounceB";
    message.text = "Please click on below links to accept or decline the invite";
    message.html = `
    <p>Please click on below links to accept or decline the invite<p>
    <div>
    <a href="http://localhost:5000/auth/accept">Accept</a>
    </div>
    <div>
    <a href="http://localhost:5000/auth/decline">Decline</a>
    </div>
    `;

    sgMail.send(message)
    .then(response => {
            res.status(200).json({
                response : response
            })
    
    })
    .catch(next);


           /* function createAccount(user) {

                let account = Account.updateOne(
                    {_id : accId},
                        {$addToSet : {
                            users : {
                            userType : "co-user",
                            __user : user._id,
                            email : user.identities[0].email
                            }
                        }}
                    )
                    .exec()
                    .then((account) => account);

                return account;
            }

            function fetchAccount() {

                let account = Account.findOne(
                    {"users.email" : email})
                .exec()
                .then(account => account)

                return account;
            }
    

            let newUser = new User({
                name : name,
                identities : [{ email : email}]
            })
            .save()
            .then((user) => createAccount(user))
            .then(() => fetchAccount())
            .then((account) =>{
                res.status(200).json({
                    accountDetails : account
                })
            })
            .catch(next)*/
       
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