/**
 * Created by abhi on 07-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function
const bcrypt   = require('bcrypt-nodejs');        // Import Bcrypt Package
const User     = require('./user');
const rand     = require('unique-random')(10000, 99999); // Import unique-random package for generating randomly unique number
const validate = require('mongoose-validator');   // Import Mongoose Validator Plugin
const vali     = require('./validate');


// User Mongoose Schema
const UserSchema = new Schema({
    appid           :    { type: String },

    username        :    { type: String,  required: true },
    email           :    { type: String,  required: true, validate: vali.emailValidator, unique: true },
    institute       :    { type: String },
    phonenum        :    { type: String,  required: true, validate: vali.phoneValidator },
    section         :    { type: String },
    paid_mem        :    { type: Boolean },
    mem_num         :    { type: String },
    past_exp        :    { type: String },
    attending_As    :    { type: String },
    interested_in   :    { type: String },
    bansw_1         :    { type: String },
    bansw_2         :    { type: String },

    password        :    { type: String, required: true, select: false },
    permission      :    { type: Boolean, default: false }, // false, if the user is a normal user and true, if the user is admin/ moderator
    qrcode          :    { type: String },
    food            :    [{type:String}],
    eventType       :    { type: Number },
    wifi            :    { type: String },
    paidFor         :    [{type:String, enum: ["ai", "android", "iot", "congress"]}]

});

// Hashing the password of the user before saving into the database
UserSchema.pre('save', function(next){
    bcrypt.hash(user.password, null, null, function(err, hash){
        if (err){
            return next(err);
        }
        user.password = hash;
        var qrcode = rand().toString();
        // Performing a check whether the randomly generated qrcode belongs to some other user or not
        User.findOne({qrcode: qrcode}).exec(function(err, outputUser){
            if (err)
                return next(err);
            else {
                if (!outputUser){
                    user.qrcode = qrcode;
                } else {
                    user.qrcode = rand().toString();
                }
            }
        });
        next();
    });
});

// Method to compare passwords in API (when user logs in)
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // Returns true if password matches, false if doesn't
};

module.exports = mongoose.model('User', UserSchema, "users"); // Export User Model for us in API
