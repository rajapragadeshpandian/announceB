const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const changeLogDetails = require('./routes/changeLog');
const feedbackDetails = require('./routes/feedback');
const changeLog = require('./models/changeLog');

mongoose.connect(keys.mongoURI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use('/changelog',changeLogDetails);
app.use('/feedback', feedbackDetails);

app.get('/changes/uniqueTags', (req, res) => {

    console.log("###", "uniqueTags");

    changeLog.aggregate([
        { $unwind : "$category"},
        { $group : {_id :"$category"}} 
    ]).exec()
    .then((tags) => {
                console.log(tags);
                    res.status(200).json({
                        tags : tags,
                        noOftags : tags.length,
                    });
    }).catch((err) => {
        res.status(500).json({
            message : "tags not found"
        });
    });

});




app.use((req,res, next) => {
    const error  = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log("$$$", error);
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

app.listen(5000);