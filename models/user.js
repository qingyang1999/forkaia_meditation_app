var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password:String,
    email:String

});
//for the passport to work on modules
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User",UserSchema);