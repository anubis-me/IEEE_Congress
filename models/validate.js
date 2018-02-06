/**
 * Created by abhi on 07-Feb-18.
 */

const  mongoose = require('mongoose');
const  validate = require('mongoose-validator');   // Import Mongoose Validator Plugin

// User Name Validator
const nameValidator = [
        validate({
            validator: 'matches',
            arguments: /^([a-zA-Z]{3,50})+$/,
            message: 'Name must be at least 3 characters, max 50, no special characters or numbers.'
        }),
        validate({
            validator: 'isLength',
            arguments: [3, 50],
            message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ];

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
        message: 'Not a correct phone number'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 13],
        message: 'Phone number should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


// Password Validator
const passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[\d]).{8,35}$/,
        message: 'Password needs to have at least one number and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


module.exports={nameValidator, phoneValidator, emailValidator, passwordValidator};
