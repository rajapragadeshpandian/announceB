
const mongoose = require('mongoose');

const  accountSchema = mongoose.Schema({
    accName : String, // announceB
    users : [{
        userType : {type : String , default : null}, // firstsignup --> owner , co Owner
        __user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
        email : {type : String , default : null}
    }]
});

//module.exports = mongoose.model('Account',accountSchema);
const Account = mongoose.model('Account', accountSchema);

function createAccount(userType, user) {

        const account = new Account({
            accName : "announceB",
            users : [{
                userType : userType,
                __user : user._id,
                email : user.identities[0].email
            }]
        })
        .save()

        return Promise.all([account, user]);
    }

    function checkUserType(user, userType) {

            const acc = Account.findOne(
                { users : {
                    $elemMatch : {
                            __user : user._id,
                            userType : userType
                        }
            }})
            .exec()
        return acc;
    }

    function getAccount(accId) {

                const acc = Account.findOne({
                    _id : accId
                })
                .exec()
            return acc;
    }

    function addUserTOAccount(accId, userType, user) {

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
            
            return Promise.all([user, account]);
    }

    function findUser(accId, user) {

        const account = Account.findOne({
            _id : accId,
            "users.__user" : user._id
        })
        .exec()

        return account;
        
    }

    function removeUserFromAccount(accId, userId) {

        const deletedAcc = Account.updateOne(
            {_id : accId},
             { $pull : {
                 users : {
                     __user : userId
                 }
             }})
             .exec()
             
         return deletedAcc;
    }

    function findAccounts(userId,count,changes) {

        const accounts = Account.find({
            "users.__user" : userId
        })
        .select('users')
        .exec()

        return Promise.all([count, changes, accounts]);
    }
    

module.exports = {
    createAccount : createAccount,
    checkUserType : checkUserType,
    getAccount : getAccount,
    removeUserFromAccount : removeUserFromAccount,
    addUserTOAccount : addUserTOAccount,
    findUser : findUser,
    findAccounts : findAccounts
}
