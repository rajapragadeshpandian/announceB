const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/users');


router.post('/register', 
passport.authenticate('local',
{ successRedirect: '/user/success',
failureRedirect: '/user/failure'}
));

/*router.post('/register',(req, res, next) => {

    const { name, email, password} = req.body;
    console.log(req.body);

    User.find({"identities.email"  : email})
    .exec()
    .then((user) => {

        if(user.length > 0 ) {
            //done(null, false);
           return res.status(500).json({
               msg : "Already existing user"
           });
        } else {

            const newUser = new User({
                name : name,
                password : password,
                identities : [{ email : email}]
        });

        return newUser.save();
        }
    })
    .then((user) => {

        res.status(200).json({
            user : user,
            msg : "user craeted"
        });

    })
    .catch(next)

});*/

router.get('/success', (req, res, next) => {
    res.send("use registered successfully");
});

router.get('/failure', (req, res, next) => {
    res.send("already existing user");
});

module.exports = router;

