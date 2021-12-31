const express = require('express');
const keys = require('./config/keys');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const changeLog = require('./models/changeLog');
const changeLogDetails = require('./routes/changeLog');
const feedbackDetails = require('./routes/feedback');
const customerDetails = require('./routes/customer');
const userDetails = require('./routes/authRoutes');
const accountDetails = require('./routes/accountRoutes');
const widget = require('./routes/widget');


require('./Services/passport');

mongoose.connect(keys.mongoURI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();



app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session(
    {
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
}
));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



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
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use('/changelog',changeLogDetails);
app.use('/feedback', feedbackDetails);
app.use('/customer', customerDetails);
app.use('/widget', widget);
app.use('/auth', userDetails);
app.use('/account', accountDetails);



app.get('/changes/uniqueTags', (req, res, next) => {

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

// function validateCookie(req, res, next) {
//     console.log("@@@",req.cookies);
//     next();
// }
// app.get('/checkcookie',validateCookie, (req, res, next) => {
//     res.send("cookie send successfully");
// })

    


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