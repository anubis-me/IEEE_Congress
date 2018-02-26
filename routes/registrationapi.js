/**
 * Created by abhi on 26-Feb-18.
 */
var Register        = require('../models/registrationdetail');    // Import User Model

module.exports = function(router) {

    // Route to register new users
    router.post('/register', function(req, res) {
        var regis          = new Register();      // Create new User object
        regis.name         = req.body.name;
        regis.section      = req.body.section;
        regis.institute    = req.body.institute;
        regis.paidmem      = req.body.paidmem;
        regis.pastexp      = req.body.pastexp;
        regis.attendingas  = req.body.attendingas;        // Save password from request to regis object
        regis.interested_in= req.body.interested_in;      // Save email from request to User object
        regis.answ1        = req.body.answ1;              // Save name from request to User object
        regis.answ2        = req.body.answ2;              // Save name from request to User object
        regis.phonenum     = req.body.phonenum;           // Save phone number from request to User object
        // Check if request is valid and not empty or null
            // Saving the new user to database
            regis.save(function(err) {

                res.json({ success: true, message: 'Account registered! ' }); // Send success message back

            });
    });

    return router; // Return the router object to server
};
