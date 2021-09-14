console.log("users");

const userSchema = new Schema({
    name: String,
    password: String,
    identities: [{
            type: String,
            email: String,
            googleId: String,
            facebookId: String,
            verified: Boolean
        }]
});