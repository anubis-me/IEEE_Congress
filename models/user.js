/**
 * Created by abhi on 07-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function
const bcrypt   = require('bcrypt-nodejs');        // Import Bcrypt Package
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
    food            :    { type: String,  required: false },
    wifi            :    { type: String}
});

// Middleware to ensure password is encrypted before saving user to database
UserSchema.pre('save', function(next) {
    const user = this;

    // Function to encrypt password
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err)
            return next(err);   // Exit if error is found
        user.password = hash;   // Assign the hash to the user's password so it is saved in database encrypted
        next();                 // Exit Bcrypt function
    });
});

// Adding object ID of the user as the qr code
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
