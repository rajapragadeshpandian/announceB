const express = require('express');
const  router = express.Router();

const Account = require('../models/account');
const User = require('../models/users');



router.post('/create', (req, res, next) => {

    const { name, email, accName, userType} = req.body;

            function createAccount(user){

                let account = Account.updateOne({accName : accName},
                        {$addToSet : {
                            userType : userType,
                            __user : user._id,
                            email : user.identities[0].email
                        }}
                    )
                    .exec()
                    .then((account) => account);

                return account;
            }

            function fetchAccount() {

                let account = Account.findOne({email : users.email})
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

    const {id} = req.body;

     Account.deleteOne({_id : id})
    .exec()
    .then(account => {
        res.status(200).json({
            message : "account deleted successfully"
        })
    })
    .catch(next)

})

router.get('/adhoc', (req, res, next) => {
    res.semd("hi");
});

module.exports = router;