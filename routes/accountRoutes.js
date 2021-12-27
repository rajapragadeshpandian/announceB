const express = require('express');
const  router = express.Router();
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const inviteUser = require('../Templates/inviteUser');

const Account = require('../models/account');
const User = require('../models/users');

const requireLogin = require('../middlewares/requireLogin');

router.get('/',  (req, res, next) => {
//checked
                const {accId} = req.query;
                Account.getAccount(accId)
                .then((account) => {
                    res.status(200).json({
                        accountDetails : account
                    })
                })
                .catch(next)
})

router.post('/invite', (req, res, next) => {

    const { email, accId, userType} = req.body;
    
                 function sendMail(user) {

                        sgMail.setApiKey(keys.sendGridKey);
                        console.log(req.body.email);
                        console.log(user);

                        const token = jwt.sign({
                        userId: user._id
                        }, keys.emailSecret , { expiresIn: '1d' }  
                        ); 

                        const toEmail = req.body.email;
                        const subject = `Invite from AnnounceB as ${req.body.userType}`;

                const message = inviteUser(toEmail, subject, token);

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

                        Account.addUserTOAccount(accId, userType, user)
                        .then(([user, account]) => sendMail(user))
                        .catch(next)
                    } 
                }
               
                Account.findUser(accId, user)
                .then((acc) => checkaccount(acc))
                .catch(next)

             } else {

                User.createNewUser(null, null, email)
                .then((user) => Account.addUserTOAccount(accId, userType, user))
                .then(([user, account]) => sendMail(user))
                .catch(next)
             }
         }

         User.getUserByEmail(email)
         .then((user) => createNewUser(user))
         .catch(next)     
});

router.get('/invite/accept/:token', (req, res, next) => {

    jwt.verify(req.params.token, keys.emailSecret,
        function(err, decoded) {
       if (err) {
           res.send("Email verification failed, possibly the link is invalid or expired");
       }
       else {
           console.log(decoded);
           const userId = decoded.userId;
           
           function checkOwnerAcc(user) {

                if(user) {

                function checkVerification(acc) {

                    if(user.verified && acc) {
                        res.redirect('/auth/login');
                    } else {

                        User.verifyFlag(userId)
                        .then(() => {
                            res.redirect(`/account/userdetails?email=${user.identities[0].email}`);  
                        })
                        .catch(next)
                    }
                }

                Account.checkUserType(user, "Owner")
                .then((acc) => checkVerification(acc))
                .catch(next)

            } else {
                    res.send("user not exist");
                }
           }
        
           User.getUserById(userId)
           .then((user) => checkOwnerAcc(user))
           .catch(next)
       }
    });
});


router.get('/userdetails', (req, res, next) => {
    res.render('userDetails', {email : req.query.email || ""});
});


router.get('/invite/decline/:token', (req, res, next) => {
    //send mail to one who invites you once declines
    // so they will delete your invite
res.send('user declined the request');
});

router.delete('/delete' , (req, res, next) => {

    const {userId, accId} = req.body;

            
                Account.removeUserFromAccount(accId, userId)
                .then(() => Account.getAccount(accId))
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

    /*Account.find(
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
    .catch(next)*/

            Account.updateOne(
                {_id : "61baedbfaf3c1a6a704c9d45"},
                    { $pull : {
                        users : {
                            __user : "61bafcfa9fc81a1af410377d"
                        }
                    }}
            )
            .exec()
            .then(() => {
                res.send("updated successfully")
            })
            .catch(next)
});

module.exports = router;