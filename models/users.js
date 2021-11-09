

const mongoose = require('mongoose');

const  userSchema = mongoose.Schema({
    name: String,
    password: String,
    identities: [{
           // type: String,
            email: String,
            googleId: String,
            facebookId: String,
            verified: Boolean
        }]
});

module.exports = mongoose.model('Users',userSchema);
