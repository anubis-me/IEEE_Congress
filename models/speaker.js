/**
 * Created by abhi on 07-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function
const validate = require('mongoose-validator');   // Import Mongoose Validator Plugin


// User E-mail Validator
const emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
        message: 'Name must be at least 3 characters, max 50, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User Phone Validator
const phoneValidator = [
    validate({
        validator: 'matches',
        arguments: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        message  : 'Not a correct phone number'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 13],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


// User Mongoose Schema
const speakerSchema = new Schema({
    name            :    { type: String,  required: true, validate: nameValidator },
    email           :    { type: String,  required: true, validate: emailValidator   , unique: true },
    phonenum        :    { type: String,  required: true, validate: phoneValidator },
    description     :    { type: String,  required: true },
    domain          :    { type: String,  required: true },
    timing          :    { type: String,  required: true }
});

module.exports = mongoose.model('Speaker', speakerSchema); // Export Speaker Model for us in API
