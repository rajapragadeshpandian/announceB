const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const customerSchema = mongoose.Schema({

    accId: { type: String, default: null },
    name: { type: String, default: null },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    customizedProps: { type: mongoose.Schema.Types.Mixed, default: null },
    likedPosts: { type: Array, default: null },
    dislikedPosts: { type: Array, default: null }
},
    {
        timestamps: true
    });

//module.exports = mongoose.model('Customer', customerSchema);
const Customer = mongoose.model('Customer', customerSchema);

function createCustomer(accId, name, email, customProps) {

    let customer = new Customer({
        accId: accId,
        name: name,
        email: email,
        customizedProps: customProps
    })
        .save()

    return customer;
}

function findCustomer(email, accId) {
    let customer = Customer.findOne({
        email: email,
        accId: accId
    }).exec()

    return customer;
}

function findCustomerById(id) {

    let customerDetails = Customer.findOne(
        { _id: id }
    ).exec()

    return customerDetails;
}

function findByIdandCondition(id, condition) {
    let customer = Customer.findOne(
        {
            "$and":
                [
                    { _id: id },
                    condition
                ]
        })
        .exec()

    return customer;
}

function findByCondition(condition) {
    const customers = Customer.find(condition)
        .exec()

    return customers;
}


function updateProps(email, customProps) {

    let customer = Customer.updateOne({ email: email },
        {
            $set: {
                customizedProps: customProps
            }
        })
        .exec()

    return customer;
}

function findByLikedPost(custId, changelogId) {

    const customer = Customer.find({
        "$and": [
            { _id: custId },
            {
                "$or": [
                    { likedPosts: changelogId },
                    { dislikedPosts: changelogId }]
            }
        ]
    })
        .exec()
    return customer;
}


function updateLikeandDislike(custId, condition) {

    let result = Customer.updateOne(
        { _id: custId },
        condition
    ).exec()

    return result;
}


function getCustomerCount(condition) {
    const customers = Customer.countDocuments(condition)
        .exec()

    return customers;
}

function uniqueCategory() {

    let customProps = Customer.aggregate([
        { $match: { accId: "announceB" } },
        { $unwind: "$customizedProps" },
        { $group: { _id: "$customizedProps" } }
    ])
        .exec()

    return customProps;
}


async function filterCustomer(condition1, condition2) {
    console.log(condition1);
    console.log(condition2);
    const filteredCustomer = await Customer.aggregate([
        { $match: condition1 },
        {
            $match: condition2
        },
        {
            $project: {
                "_id": 1,
                "name": 1,
                "email": 1,
                "customizedProps": 1
            }
        }
    ]);

    console.log(filteredCustomer);

    return filteredCustomer;
}

//{} or { $or: { 1, 2, 3} }
// {
//     $match: {
//         "$or": [{ "plan": { "$eq": "starter" } }, { "rental": { "$eq": "monthly" } }]
//     }
// },
//{ plan: agency }




module.exports = {
    findCustomer: findCustomer,
    createCustomer: createCustomer,
    updateProps: updateProps,
    findCustomerById: findCustomerById,
    findByIdandCondition: findByIdandCondition,
    findByCondition: findByCondition,
    findByLikedPost: findByLikedPost,
    updateLikeandDislike: updateLikeandDislike,
    uniqueCategory: uniqueCategory,
    getCustomerCount: getCustomerCount,
    filterCustomer: filterCustomer
}


















