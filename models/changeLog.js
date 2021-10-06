const mongoose = require('mongoose');

const changeLogSchema = mongoose.Schema(

    {
        title : {type : String , required : true},
        category : {type :[String], required : true},
        body : {type : String, required : true},
        like : {type : Number, default : 0 },
        dislike : {type : Number , default : 0 },
        // __user : {type : Schema.Types.ObjectId , ref : 'User'}
    },
    {
        timestamps: true 
    }    

);

changeLogSchema.index({title: 'text'});
module.exports = mongoose.model('Changelog',changeLogSchema);

