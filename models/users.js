
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const  userSchema = mongoose.Schema({
    name: { type : String, default : null},
    password: { type : String, default : null},
    identities: [{
            email: { type : String, default : null},
            googleId: { type : String, default : null}
    }],
    verified: { type : Boolean, default : null}
            
});

//module.exports = mongoose.model('Users',userSchema);
const User = mongoose.model('Users',userSchema);

function getUserByEmail(email) {
                const user = User.findOne({
                        "identities.email"  : email
                })
                .exec()      
        return user;
}

const hashPassword = (password) => {
        const hash = bcrypt.hash(password, 10);
        return hash;
}

const comparePassword = (password1, password2) => {
        const result = bcrypt.compare(password1, password2);
        return result;
}

const createNewUser = (name, hash, email) => {

        const newUser = new User({
                name : name,
                password  : hash,
                identities : [{ email : email}]
                })
                .save()

        return newUser;
}

function createGoogleUser(name, email, id) {

        const newUser = new User({
                name : name,
                identities : [{ 
                    email : email,
                    googleId : id
                    }],
                    verified : true
            })
            .save()

        return newUser;
}

function updateGoogleId(email, id) {

        const googleId = User.updateOne(
        {"identities.email" : email},
        { "$set" : {
        "identities.$.googleId" : id,
        verified : true
        }}
        )
        .exec()
        return googleId;
}



module.exports = {
        getUserByEmail : getUserByEmail,
        hashPassword : hashPassword,
        createNewUser : createNewUser,
        comparePassword : comparePassword,
        createGoogleUser : createGoogleUser,
        updateGoogleId : updateGoogleId
}


