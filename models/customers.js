const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    accId : { type : String},
    name : { type : String},
    email : { 
        type : String,
        required : true,
        match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
    customizedProps : { type : mongoose.Schema.Types.Mixed, default  : null},
    likedPosts : [
        {
            __change : {type : mongoose.Schema.Types.ObjectId, ref : 'Changelog' },
             responded :{ type : String}
        }
    ]
});

module.exports = mongoose.model('Customer', customerSchema);


// customerDetails : [{
//     name : String,
//     email : String,
//     subscription : String
// }]
// customerDetails : Array

// have to send both key and value to filter customer as we dont have
//a fixed key to save the customer

// accId should get associated to each customer to 
// get customers for specific accpunt







  



