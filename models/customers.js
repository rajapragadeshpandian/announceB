const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name : { type : String},
    email : { 
        type : String,
        required : true,
        match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
    type : String,
    likedPosts : [
        {
            __change : {type : mongoose.Schema.Types.ObjectId, ref : 'Changelog' },
             responded :{ type : String}
        }
    ]
});

module.exports = mongoose.model('Customer', customerSchema);