const mongoose = require('mongoose');

const  FeedbackSchema = mongoose.Schema({
    contentTitle: String,
    content : {type : String},
    customerName : { type : String},
    customerType : String,
    __change : {type : mongoose.Schema.Types.ObjectId , ref : 'Changelog'}
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('Feedback',FeedbackSchema);

