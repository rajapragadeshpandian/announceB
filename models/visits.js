const mongoose = require('mongoose');

const visitSchema = mongoose.Schema(

    {
        __change : {type : Schema.Types.ObjectId , ref : 'change'},
        createdAt : Date //ISODate("2020-04-22T10:19:24.653Z"
    }

);

module.exports = mongoose.model('Visits',visitSchema);

