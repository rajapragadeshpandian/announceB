const mongoose = require('mongoose');

const segmentSchema = mongoose.Schema(

    {
        title : {type : String , required : true, default : null},
        customers : {type : Array, default : null}
    }

);

module.exports = mongoose.model('Segment',segmentSchema);

// it should be one to many relatioship == >  child referencing

// two separate routes for create segment and get segment