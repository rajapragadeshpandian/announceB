
const mongoose = require('mongoose');

// account will get created once the user signedUp and team 
// gets invited 
const  accountSchema = mongoose.Schema({
    accName : String, // announceB
    users : [{
        userType : {type : String , default : null}, // firstsignup --> owner , co Owner
        __user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
        email : {type : String , default : null}
    }]
});

module.exports = mongoose.model('Account',accountSchema);


