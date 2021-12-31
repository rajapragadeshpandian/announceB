const mongoose = require('mongoose');

const segmentSchema = mongoose.Schema(

    {
        title : {type : String , required : true, default : null},
        condition : { type : mongoose.Schema.Types.Mixed, default  : null}
    }

);

//module.exports = mongoose.model('Segment',segmentSchema);
const Segment = mongoose.model('Segment',segmentSchema);

function getSegmentByTitle(title) {

    const segment = Segment.find({
         title : title
        })
        .exec()
    return segment;
}

function getSegmentById(segmentId) {
    const segment = Segment.findById(
        { _id : segmentId}
    )
    .exec()

    return segment;
}


function createSegment(title, condition) {
    const segment = new Segment({
        title : title,
        condition : condition
    })
    .save()

    return segment;
}

function updateSegment(segmentId, title, condition) {
  const segment =  Segment.findByIdAndUpdate(
      { _id : segmentId},
        { $set : {
           title : title,
           condition : condition
        }}
    )
    .exec()

    return segment;
}

function deleteSegment(segmentId) {
    const segment = Segment.findByIdAndDelete(
        {_id : segmentId})
    .exec()

    return segment;
}

module.exports = {
    getSegmentByTitle : getSegmentByTitle,
    createSegment : createSegment,
    getSegmentById : getSegmentById,
    updateSegment : updateSegment,
    deleteSegment : deleteSegment
}

