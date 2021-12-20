
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

    function checkOwner(user) {
            const ownerAcc = Account.findOne(
                { users : {
                    $elemMatch : {
                            __user : user._id,
                            userType : "Owner"
                        }
            }})
            .exec()
        return ownerAcc;
    }

    

module.exports = {
    createAccount : createAccount,
    checkOwner : checkOwner
}
