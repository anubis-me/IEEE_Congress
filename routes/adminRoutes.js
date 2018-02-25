/**
 * Created by Yash 1300 on 25-Feb-18.
 */
var User            = require('../models/user');    // Import User Model
var Coupon          = require('../models/wifi_coupon'); // Import Wifi coupon model
var middlewares     = require('../middlewares/middlewares'); // Importing the middlewares

module.exports = function(router){

    router.use(function(req, res, next){
        middlewares.checkAdmin(req, res, next);
    });


    //Routes for user to take meals
    /** route = breakfast, to make the user eat breakfast **/
    /** route = lunch, to make the user eat lunch **/
    /** route = dinner, to make the user eat dinner **/
    router.post('/food/:route', function(req, res){
        var endpoint = req.params.route;
        var qrcode = req.body.qrcode;
        var modId = req.body.uappid;
        var parameter = endpoint;
        if (["breakfast", "lunch", "dinner"].indexOf(endpoint) < 0)
            res.json({success: false, message: "Wrong endpoint entered"});
        else {
            User.findOne({appid: modId, permission: true}).exec(function(err){
                if (err){
                    console.log(err);
                    res.json({success: false, message: "An error occurred"});
                } else {
                    User.findOne({qrcode: qrcode}).exec(function(err, outputUser){
                        if (err){
                            console.log(err);
                            res.json({success: false, message: "An error occurred"});
                        } else {
                            if (!outputUser){
                                res.json({success: false, message: "No such user exists"});
                            } else {
                                // Checking if the user has already consumed the meal or not
                                if (outputUser.food.indexOf(parameter) < 0){
                                    User.findOneAndUpdate({qrcode: qrcode}, {$push:{food:parameter}}).exec(function(err){
                                        if (err){
                                            console.log(err);
                                            res.json({success: false, message: "An error occurred"});
                                        } else {
                                            res.json({success: true, message: "User has now eaten " + endpoint});
                                        }
                                    });
                                } else {
                                    res.json({success: false, message: "The user has already consumed " + endpoint});
                                }
                            }
                        }
                    });
                }
            });
        }
    });


// Route for adding a Wifi coupon to the coupons collections
    router.post('/addWifiCoupon', function(req, res){
        var coupId = req.body.coupId;
        var coupPass = req.body.coupPass;
        var coupon = new Coupon({
            couponId: coupId,
            couponPassword: coupPass
        });
        coupon.save(function(err){
            if (err){
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            } else {
                res.json({success: true, message: "Wifi coupon added successfully"});
            }
        });
    });

// Route for activating a wifi coupon for the user
// The coupon will be in the user object like => wifi: <couponCode> <couponPassword>
    router.post('/activate', function(req, res){
        var qrcode = req.body.qrcode; // Participant QR Code
        var modId = req.body.uappid; //Moderator app id

        User.findOne({appid: modId, permission: true}).exec(function(err){
            if (err){
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            } else {
                Coupon.find({activated: false}).exec(function(err, coupons){
                    // Checking if the coupons are available or not
                    if (coupons.length <= 0){
                        res.json({success: false, message: "No more wifi coupons available"});
                    } else {
                        var coupon = coupons[0];
                        User.findOneAndUpdate({qrcode: qrcode}, {wifi: coupon.couponId + " " + coupon.couponPassword}).exec(function(err, outputUser){
                            if (err){
                                console.log(err);
                                res.json({success: false, message: "An error occurred"});
                            } else {
                                if (!outputUser){
                                    res.json({success: false, message: "No such user exists"});
                                } else {
                                    // Setting activated: true for that coupon from the coupons collection because that coupon is no longer available to other users
                                    coupon.activated = true;
                                    coupon.save().exec(function(err){
                                        if (err){
                                            console.log(err);
                                            res.json({success: false, message: "Error occurred while activating the coupon"});
                                        } else {
                                            res.json({success: true, message: "Wifi coupon activated", coupon:outputUser.wifi});
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    // Route for admin to validate whether the user has paid for an event or not
    /** route = ai, to validate the user for ai **/
    /** route = android, to validate the user for android **/
    /** route = iot, to validate the user for iot **/
    /** route = congress, to validate the user for congress **/

    router.post('/validatePayment/:route', function(req, res){
        var endpoint = req.params.route;
        var qrcode   = req.body.qrcode;
        if (["ai", "android", "iot", "congress"].indexOf(endpoint) < 0)
            res.json({success: false, message: "Wrong endpoint entered"});
        else {
            User.findOne({qrcode: qrcode}).exec(function(err, outputUser){
                if (err){
                    console.log(err);
                    res.json({success: false, message: "An error occurred"});
                } else {
                    if (!outputUser){
                        res.json({success: false, message: "No user with this qrcode"});
                    } else {
                        var saveTheUser = false;
                        if (outputUser.paidFor.length < 2){
                            if (outputUser.paidFor.length === 0){
                                outputUser.paidFor.push(event);
                                saveTheUser = true;
                            } else {
                                if (["ai", "android", "iot"].indexOf(endpoint)>=0 && outputUser.paidFor[0] === "congress"){
                                    outputUser.paidFor.push(event);
                                    saveTheUser = true;
                                }
                            }
                            if (saveTheUser){
                                outputUser.save(function(err){
                                    if (err){
                                        res.json({success: false, message: "An error occurred"});
                                    } else {
                                        res.json({success: true, message: "User's payment validated for " + endpoint + " event successfully"});
                                    }
                                });
                            }
                        } else {
                            res.json({success: false, message: "User registered for maximum number of events"});
                        }
                    }
                }
            });
        }
    });

    return router;
};

