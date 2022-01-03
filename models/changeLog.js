const mongoose = require('mongoose');

const changeLogSchema = mongoose.Schema(

    {
        title : {type : String , required : true, default : null},
        category : {type :[String], required : true, default : null},
        body : {type : String, required : true, default : null},
        like : {type : Number, default : 0 },
        dislike : {type : Number , default : 0 },
        accId : { type : String, default : null},
        conditions : { type : mongoose.Schema.Types.Mixed, default  : null},
         __user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'}
    },
    {
        timestamps: true 
    }    

);

changeLogSchema.index({title: 'text'});
//module.exports = mongoose.model('Changelog',changeLogSchema);
const changeLog = mongoose.model('Changelog',changeLogSchema);

function createChanges(title, category, body, accId, userId) {
    // add user reference here
    console.log(category);
    const changes = new changeLog({
        title : title,
        category : category.split(',').map((item) => item.trim()),
        body : body,
        accId : accId,
        __user : userId
    })
    .save()

    return changes;
}

function getChanges(accId, findText, val, limit) {

    const changes =  changeLog.find({accId : accId, findText})
    .select('title category body _id disLike like conditions')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()

    return changes;
}

function getChangeById(id) {

    const change = changeLog.findById(
        {_id : id}
    )
    .select('title category body _id dislike like conditions')
    .exec()

    return change;
}

function getChangeByAcc(accId) {
    const changes = changeLog.find({accId : accId})
    .select('_id conditions')
    .exec()
    return changes;
}

function getChangeByCondition(condition, findText, val, limit) {
    const changes =  changeLog.find({
        "$and" : [
            condition,
            findText   
        ]
    })
    .select('title category body _id disLike like')
    .sort({ createdAt : -1 })
    .skip(val)
    .limit(limit)
    .exec()

    return changes;
}
        
function getCount(accId, findText) {
    const count = changeLog.countDocuments(
        {accId : accId,findText}
    )
    .exec()
    
    return count;
    //return Promise.all([count, changes]);
}

function getCountByCondition(condition, findText) {
    const count = changeLog.countDocuments(
        {"$and":[
            condition,
            findText
        ]}
    )
    .exec()
    return count;
    //return Promise.all([count, changes]);
}

function updateChangelog(id, title, category, body) {
    const change = changeLog.findByIdAndUpdate({_id : id},
        { $set : {
           title : title,
           category : category.split(',').map((item) => item.trim()),
           body : body
        }}
   )
   .exec()
   return change;
}


const removeChange = (id) => {
    const change = changeLog.remove({ _id : id})
    .exec()
    return change;
}

function  setFilter(id, condition) {

    const change = changeLog.updateOne({ _id : id},
        { $set :{
            conditions : condition                 
        }}
    )
    .exec()
    
    return change;  
}

function updateLikeandDislike(changelogId, choice) {
    let change =   changeLog.updateOne(
        {_id : changelogId },
        { $inc : choice }
    )
    .exec()
    return change;
}

function uniqueTags() {
    let tags = changeLog.aggregate([
        { $unwind : "$category"},
        { $group : {_id :"$category"}} 
    ]).exec()
    
    return tags;
}





module.exports = {
    createChanges : createChanges,
    getChanges : getChanges,
    getCount : getCount,
    getChangeByAcc : getChangeByAcc,
    getChangeByCondition : getChangeByCondition,
    setFilter : setFilter,
    getCountByCondition : getCountByCondition,
    updateChangelog : updateChangelog,
    getChangeById : getChangeById,
    updateLikeandDislike : updateLikeandDislike,
    removeChange : removeChange  ,
    uniqueTags : uniqueTags

    //remove : remove
}

