const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect(keys.mongoURI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

const changeLogDetails = require('./routes/changeLog');
const feedbackDetails = require('./routes/feedback');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use('/changelog',changeLogDetails);
app.use('/feedback', feedbackDetails);

app.use((req,res, next) => {
    const error  = new Error('not found');
    error.status = 404;
    next();
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

app.listen(5000);