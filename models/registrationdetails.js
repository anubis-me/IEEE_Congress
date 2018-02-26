/**
 * Created by abhi on 26-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function
const validate = require('mongoose-validator');   // Import Mongoose Validator Plugin
const vali     = require('./validate');


// User Mongoose Schema
const registerSchema = new Schema({
    name            :    { type: String },
    section         :    { type: String },
    institute       :    { type: String },
    email           :    { type: String,  validate: vali.emailValidator, unique: true },
    phonenum        :    { type: String,  validate: vali.phoneValidator },
    paidmem         :    { type: Boolean },
    mem_num         :    { type:String },
    pastexp         :    { type: String},
    attendingas     :    { type: String},
    interested_in   :    { type: String},
    answ1           :    { type: String},
    answ2           :    { type: String}

});


module.exports = mongoose.model('Register', registerSchema, "register"); // Export User Model for us in API
