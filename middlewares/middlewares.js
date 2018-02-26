/**
 * Created by Yash 1300 on 25-Feb-18.
 */
var User            = require('../models/user');    // Import User Model
var secret          = 'harrypotterfdrtynbvrt';
var jwt             = require('jsonwebtoken');

function checkAdmin(req, res, next){
    var token = req.headers['x-access-token'];
    if (token){
        jwt.verify(token, secret, function(err, decoded){
            if (err){
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            } else {
                if (decoded){
                    var userId = decoded._id;
                    User.findOne({_id: userId, permission: true}).exec(function(err, outputUser){
                        if (err){
                            console.log(err);
                            res.json({success: false, message: "An error occurred"});
                        } else {
                            if (outputUser){
                                next();
                            } else {
                                res.json({success: false, message: "User is not a moderator"});
                            }
                        }
                    });
                }
            }
        });
    }
}

function checkParticipant(req, res, next){
    var token = req.headers['x-access-token'];
    if (token){
        jwt.verify(token, secret, function(err, decoded){
            if (err){
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            } else {
                if (decoded){
                    var userId = decoded._id;
                    User.findOne({_id: userId, permission: false}).exec(function(err, outputUser){
                        if (err){
                            console.log(err);
                            res.json({success: false, message: "An error occurred"});
                        } else {
                            if (outputUser){
                                req.decoded = decoded;
                                next();
                            } else {
                                res.json({success: false, message: "User is not a participant"});
                            }
                        }
                    });
                }
            }
        });
    }
}

module.exports = {checkAdmin: checkAdmin, checkParticipant: checkParticipant};