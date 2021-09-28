const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const changeLogDetails = require('./routes/changeLog');
const feedbackDetails = require('./routes/feedback');
const customerDetails = require('./routes/customer');
const changeLog = require('./models/changeLog');

mongoose.connect(keys.mongoURI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept, Authorization");

    if(req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
    }
    next();
});

app.use('/changelog',changeLogDetails);
app.use('/feedback', feedbackDetails);
app.use('/customer', customerDetails);

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
    }).catch(next);

});


app.use((req,res, next) => {
    const error  = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log("###", "common error handler called");
    console.log("$$$", error);
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

app.listen(5000);