
const mongoose = require('mongoose');

const  userSchema = mongoose.Schema({
    name: { type : String, default : null},
    password: { type : String, default : null},
    identities: [{
            email: { type : String, default : null},
            googleId: { type : String, default : null},
            verified: { type : Boolean, default : null}
    }]
            
});

module.exports = mongoose.model('Users',userSchema);


/*db.users.find({ "identities.email" : "prag@gmail.com"}).pretty()
{
        "_id" : ObjectId("619ceffe2907930eb936300d"),
        "name" : "pragadesh",
        "password" : "12345",
        "identities" : [
                {
                        "email" : "prag@gmail.com",
                        "googleId" : null
                }
        ]
}

db.users.update({"identities.email" : "prag@gmail.com"},
... { "$set" : {
... "identities.$.googleId" : "67890"
... }}
... );
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
*/