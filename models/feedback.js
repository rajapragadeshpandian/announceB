const mongoose = require('mongoose');

const  FeedbackSchema = mongoose.Schema({
    title: String,
    content : {type : String},
    customer : {
        name : { type : String},
        id : {type : mongoose.Schema.Types.ObjectId , ref : 'Customer'}
    },
    __change : {type : mongoose.Schema.Types.ObjectId , ref : 'Changelog'}
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('Feedback',FeedbackSchema);


// customer : { type : mongoose.Schema.Types.Mixed, default  : null}

