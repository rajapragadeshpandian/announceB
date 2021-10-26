const mongoose = require('mongoose');

const segmentSchema = mongoose.Schema(

    {
        title : {type : String , required : true, default : null},
        condition : { type : mongoose.Schema.Types.Mixed, default  : null}
    }

);

module.exports = mongoose.model('Segment',segmentSchema);

// it should be one to many relatioship == >  child referencing

// two separate routes for create segment and get segment


// if customer login save the customer if new
// check the segment schema in which segments the customers are assciated
// show the relevant chnages to customer 
