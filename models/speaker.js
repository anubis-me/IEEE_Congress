/**
 * Created by abhi on 07-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function
const validate = require('mongoose-validator');   // Import Mongoose Validator Plugin
const vali     = require('./validate');


// User Mongoose Schema
const speakerSchema = new Schema({
    name            :    { type: String,  required: true, validate: vali.nameValidator },
    email           :    { type: String,  required: true, validate: vali.emailValidator, unique: true },
    phonenum        :    { type: String,  required: true, validate: vali.phoneValidator },
    description     :    { type: String,  required: true },
    domain          :    { type: String,  required: true },
    timing          :    { type: String,  required: true }
});

module.exports = mongoose.model('Speaker', speakerSchema); // Export Speaker Model for us in API
