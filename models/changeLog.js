const mongoose = require('mongoose');

const changeLogSchema = mongoose.Schema(

    {
        title : {type : String , required : true, default : null},
        category : {type :[String], required : true, default : null},
        body : {type : String, required : true, default : null},
        like : {type : Number, default : 0 },
        dislike : {type : Number , default : 0 },
        accId : { type : String, default : null}
        // __user : {type : Schema.Types.ObjectId , ref : 'User'}
    },
    {
        timestamps: true 
    }    

);

changeLogSchema.index({title: 'text'});
module.exports = mongoose.model('Changelog',changeLogSchema);

