const { types, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordLocalsMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});


userSchema.plugin(passwordLocalsMongoose);

module.exports = mongoose.model('User',userSchema);