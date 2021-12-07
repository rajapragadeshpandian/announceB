const express = require('express');
const  router = express.Router();

const Account = require('../models/account');
const User = require('../models/users');

router.get('/', (req, res, next) => {

                const {accName} = req.query;
                console.log(accName)
                Account.find({accName : accName})
                .find()
                .exec()
                .then((acc) => {
                    res.status(200).json({
                        accountDetails : acc
                    })
                    
                })
                .catch(next)

})

router.post('/invite', (req, res, next) => {

    const { name, email, accName} = req.body;

            function createAccount(user){

                let account = Account.updateOne(
                    {accName : accName},
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
            .catch(next)
       
});

router.delete('/delete' , (req, res, next) => {

    const {userId, accName} = req.body;

            function deleteAccount() {

               let deletedAcc = Account.updateOne(
                   {accName : accName},
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
                        {accName : accName})
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
          

})

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