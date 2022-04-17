const mongoose = require('mongoose');


var todaysDate = new Date();
console.log(todaysDate);

function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

var date = convertDate(todaysDate);

console.log(date);

// const opts = {
//     // Make Mongoose use Unix time (seconds since Jan 1, 1970)
//     timestamps: new Date(date)
// };
// console.log(opts);

const changeLogSchema = mongoose.Schema(

    {
        title: { type: String, required: true, default: null },
        category: { type: [String], required: true, default: null },
        body: { type: String, required: true, default: null },
        like: { type: Number, default: 0 },
        dislike: { type: Number, default: 0 },
        visits: { type: Number, default: 0 },
        accId: { type: String, default: null },
        status: { type: String, default: null },
        conditions: { type: mongoose.Schema.Types.Mixed, default: null },
        __user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

        createdAt: Date,
        updatedAt: Date
    }
);



changeLogSchema.index({ title: 'text' });
//module.exports = mongoose.model('Changelog',changeLogSchema);
const changeLog = mongoose.model('Changelog', changeLogSchema);

function createChanges(title, category, body, accId, userId, createdDate) {
    // add user reference here
    console.log(category);
    console.log(createdDate);

    let status, publishDate;
    console.log(date);
    //createdDate
    if (createdDate > date) {
        status = "scheduled";
        publishDate = createdDate;
    } else {
        status = "published";
        publishDate = date;
    }

    const changes = new changeLog({
        title: title,
        category: category.split(',').map((item) => item.trim()),
        body: body,
        accId: accId,
        __user: userId,
        status: status,
        createdAt: new Date(publishDate),
        updatedAt: new Date(publishDate),
    })
        .save()

    return changes;
}

function getChanges(accId, findText, val, limit) {

    console.log(limit);
    console.log(val);
    const obj = { accId: accId }
    if (findText) {
        obj.title = findText
    }
    const changes = changeLog.find(obj)
        .select('title category body _id disLike like conditions visits status createdAt')
        .sort({ createdAt: -1 })
        .skip(val)
        .limit(limit)
        .exec()

    return changes;
}

function getChangeById(id) {

    const change = changeLog.findById(
        { _id: id }
    )
        .select('title category body _id dislike like conditions visits status createdAt')
        .exec()

    return change;
}

function getChangeByAcc(accId) {
    const changes = changeLog.find({ accId: accId })
        .select('_id conditions')
        .exec()
    return changes;
}

function getChangeByCondition(condition, findText, val, limit) {
    const changes = changeLog.find({
        "$and": [
            condition,
            findText
        ]
    })
        .select('title category body _id disLike like')
        .sort({ createdAt: -1 })
        .skip(val)
        .limit(limit)
        .exec()

    return changes;
}

function getCount(accId, findText) {
    const count = changeLog.countDocuments(
        { accId: accId, findText }
    )
        .exec()

    return count;
    //return Promise.all([count, changes]);
}

function getCountByCondition(condition, findText) {
    const count = changeLog.countDocuments(
        {
            "$and": [
                condition,
                findText
            ]
        }
    )
        .exec()
    return count;
    //return Promise.all([count, changes]);
}

function updateChangelog(id, title, category, body) {
    const change = changeLog.findByIdAndUpdate({ _id: id },
        {
            $set: {
                title: title,
                category: category.split(',').map((item) => item.trim()),
                body: body
            }
        }
    )
        .exec()
    return change;
}


const removeChange = (id) => {
    const change = changeLog.remove({ _id: id })
        .exec()
    return change;
}

function setFilter(id, condition) {

    const change = changeLog.updateOne({ _id: id },
        {
            $set: {
                conditions: condition
            }
        }
    )
        .exec()

    return change;
}

function updateLikeandDislike(changelogId, choice) {
    let change = changeLog.updateOne(
        { _id: changelogId },
        { $inc: choice }
    )
        .exec()
    return change;
}

function uniqueTags() {
    let tags = changeLog.aggregate([
        { $unwind: "$category" },
        { $group: { _id: "$category" } }
    ]).exec()

    return tags;
}

function incrementVisit(id) {

    let data = changeLog.updateOne(
        {
            _id: id
        },
        { $inc: { visits: 1 } }
    )
        .exec()

    return data;
}

function adhoc() {

    //problem with accid on pagination
    //62286323e35d5039ff0396cb
    //62286357e35d5039ff0396d1
    //62286323e35d5039ff0396cb
    //622860e6e35d5039ff0396bc
    //2022-03-25T11:32:14.925Z
    //2023-04-15T11:00:00.000Z

    //createdAt
    // :
    // 2022-03-09T00:00:00.000+00:00
    // updatedAt
    // :
    // 2022-03-09T00:00:00.000+00:00
    //let createdDate = convertDate('2023-04-15T11:32:14.925Z');
    let status;
    // console.log(date);
    // if ('2022-02-15' > date) {
    //     status = "scheduled"
    // } else {
    //     status = "published"
    // }
    console.log(status);
    let data = changeLog.updateMany(
        {
            $or: [{ _id: "622860e6e35d5039ff0396bc" },
            { _id: "62286323e35d5039ff0396cb" }]
        },
        {
            status: "scheduled"
        }
    )
        .exec()

    return data;
}

function getAllChanges() {
    const change = changeLog.find()
        .limit(10)
        .exec()

    return change;
}


module.exports = {
    createChanges: createChanges,
    getChanges: getChanges,
    getCount: getCount,
    getChangeByAcc: getChangeByAcc,
    getChangeByCondition: getChangeByCondition,
    setFilter: setFilter,
    getCountByCondition: getCountByCondition,
    updateChangelog: updateChangelog,
    getChangeById: getChangeById,
    updateLikeandDislike: updateLikeandDislike,
    removeChange: removeChange,
    uniqueTags: uniqueTags,
    incrementVisit: incrementVisit,
    adhoc: adhoc,
    getAllChanges: getAllChanges

    //remove : remove
}

