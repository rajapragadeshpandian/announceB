const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/users');

passport.serializeUser(function(user, done) {
    console.log("serialize",user);
    done(null,user);
  });
  
  passport.deserializeUser(function(user, done) {
      console.log("deserialize", user);
    done(null, user);
  });   

LocalStrategy.passReqToCallback = true;
passport.use(
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    },
     (req, email, password, done) => {
         console.log("Email", email);
         console.log(password);
         console.log("req", req.body);

         function createUser(user) {

            if(user.length > 0) {
                console.log("user exist");
                 return done(null, false);
                 
            } else {

                let newUser = new User({
                    name : req.body.name,
                    password  : password,
                    identities : [{ email : email}]
                })
                .save()
                .then((user) => {
                    return done(null, user);
                })
                .catch(err => done(err))
            
            }
         }

     User.find({"identities.email"  : email})
    .exec()
    .then((user) => createUser(user))
    .catch(err => done(err));
          
    })
);