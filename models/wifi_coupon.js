const mongoose = require('mongoose');

var couponSchema = new mongoose.Schema({
    couponId:{
        type:String,
        required: true
    },
    couponPassword:{
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('WifiCoupon', couponSchema, "wifiCoupons");