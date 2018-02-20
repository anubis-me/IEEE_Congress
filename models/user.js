/**
 * Created by abhi on 07-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function
const bcrypt   = require('bcrypt-nodejs');        // Import Bcrypt Package
const rand     = require('unique-random')(10000, 99999); // Import unique-random package for generating randomly unique number
const validate = require('mongoose-validator');   // Import Mongoose Validator Plugin
const vali     = require('./validate');


// User Mongoose Schema
const UserSchema = new Schema({
    appid           :    { type: String },
    username        :    { type: String,  required: true },
    password        :    { type: String,  required: true, select: false },
    email           :    { type: String,  required: true, validate: vali.emailValidator, unique: true },
    phonenum        :    { type: String,  required: true, validate: vali.phoneValidator },
    permission      :    { type: Boolean, default: false },
    qrcode          :    { type: String },
    food            :    [ {type:String} ],
    wifi            :    { type: String},
    isAdmin         :    { type: Boolean, default:false} // false, if the user is a normal user and true, if the user is admin
});

// Hashing the password of the user before saving into the database
UserSchema.pre('save', function(next){
    bcrypt.hash(user.password, null, null, function(err, hash){
        if (err){
            return next(err);
        }
        user.password = hash;
        user.qrcode = rand().toString();
        next();
    });
});

// Adding object ID of the user as the qr code after the user is saved
UserSchema.post('save', function(next) {
    const user = this;
    user.qrcode = user._id;
    next();
});


// Method to compare passwords in API (when user logs in)
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // Returns true if password matches, false if doesn't
};

module.exports = mongoose.model('User', UserSchema); // Export User Model for us in API
