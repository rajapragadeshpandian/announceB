const mongoose = require('mongoose');

const  FeedbackSchema = mongoose.Schema({
    title: String,
    content : {type : String},
    __change : {type : mongoose.Schema.Types.ObjectId , ref : 'Changelog'},
    __customer : { type : mongoose.Schema.Types.Mixed, default  : null}    
},
    {
        timestamps : true
    }
);

//module.exports = mongoose.model('Feedback',FeedbackSchema);

const Feedback = mongoose.model('Feedback',FeedbackSchema);
// customer : { type : mongoose.Schema.Types.Mixed, default  : null}

function createFeedback(title, content,changeId, customer) {

    const feedback = new Feedback({
        title: title,
        content : content,
        __change : changeId,
        __customer : {
            name : customer.name,
            id : customer._id
        }
    })
    .save()

    return feedback;
}


function getFeedback(id, val, limit) {

    const feedbacks = Feedback.find(
        {__change : id}
    )
    .select('_id title content __change')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()

    return feedbacks;
   // return Promise.all([feedbacks,change]);
}

function getFeedbackById(id, val, limit) {

    const feedbacks = Feedback.find(
        {__change : id}
    )
    .select('_id title content __change')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()

    return feedbacks;
}


function count(id) {
    const count = Feedback.countDocuments(
        {__change : id})
    .exec()
    
    return count;
    //return Promise.all([feedbacks, change,count]);
}

function updateFeedback(feedbackId, title, content) {

    const feedback = Feedback.findByIdAndUpdate({ _id : feedbackId },
        {
            $set : {
                title: title,
                content : content
            }}
        )
        .exec()
        return feedback;
}

function deleteFeedback(feedbackId) {

    const feedback = Feedback.findByIdAndDelete({
         _id : feedbackId
        })
    .exec()
    return feedback;
}

module.exports = {
    createFeedback : createFeedback,
    deleteFeedback : deleteFeedback,
    updateFeedback : updateFeedback,
    count : count,
    getFeedback : getFeedback,
    getFeedbackById : getFeedbackById 
}



