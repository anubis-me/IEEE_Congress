/**
 * Created by abhi on 07-Feb-18.
 */
var User            = require('../models/user');    // Import User Model
var jwt             = require('jsonwebtoken');      // Import JWT Package
var secret          = 'harrypotterfdrtynbvrt';      // Create custom secret for use in JWT
var middlewares     = require('../middlewares/middlewares');

module.exports = function(router) {

    router.use(function(req, res, next){
        middlewares.checkParticipant(req, res, next);
    });

    // Route for user to know his/her details (saved)
    router.get('/getUserDetails', function(req, res){
        var qrcode = req.decoded.qrcode;
        User.findOne({qrcode: qrcode}).exec(function(err, outputUser){
            if (err){
                console.log(err);
                res.json({success: false, message: "An error occurred"});
            } else {
                res.json({success: true, message: "User details fetched successfully", user: outputUser});
            }
        });
    });

    return router; // Return the router object to server
};
