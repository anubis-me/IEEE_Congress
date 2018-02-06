/**
 * Created by abhi on 07-Feb-18.
 */
const mongoose = require('mongoose');             // Import Mongoose Package
const Schema   = mongoose.Schema;                 // Assign Mongoose Schema function

// Food Mongoose Schema
const foodSchema = new Schema({
    });

module.exports = mongoose.model('Food', foodSchema); // Export Speaker Model for us in API
