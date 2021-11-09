

const mongoose = require('mongoose');

const  accountSchema = mongoose.Schema({
    accName : String,
    users : [{
        userType : String, // owner , co Owner
        __user : {type : Schema.Types.ObjectId , ref : 'User'},
        name : String,
        email : String
    }]
});

module.exports = mongoose.model('Account',accountSchema);


