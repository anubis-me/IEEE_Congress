/**
 * Created by Yash 1300 on 25-Feb-18.
 */
var User            = require('../models/user');    // Import User Model
var jwt             = require('jsonwebtoken');      // Import JWT Package
var secret          = 'harrypotterfdrtynbvrt';      // Create custom secret for use in JWT
var nodemailer      = require('nodemailer');        // Import Nodemailer Package
var sgTransport     = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
var router = require('express').Router();



// Start Sendgrid
var options = {
    auth: {
        api_user: process.env.DB_USER ,
        api_key:process.env.DB_PASS
    }
};


var client = nodemailer.createTransport(sgTransport(options)); // Using Sendgrid configuration


// Route to register new users
router.post('/reguser', function(req, res) {
    var user          = new User();          // Create new User object
    user.appid        = req.body.appid;
    user.password     = req.body.password;   // Save password from request to User object
    user.email        = req.body.email;      // Save email from request to User object
    user.username     = req.body.username;   // Save name from request to User object
    user.phonenum     = req.body.phonenum;   // Save phone number from request to User object
    user.institute    = req.body.institute;
    user.section      = req.body.section;
    user.paid_mem     = req.body.paid_mem;
    user.mem_num      = req.body.mem_num;
    user.past_exp     = req.body.past_exp;
    user.attending_As = req.body.attending_As;
    user.interested_in= req.body.interested_in;
    user.bansw_1      = req.body.bansw_1;
    user.bansw_2      = req.body.bansw_2;
    // Check if request is valid and not empty or null
    if (req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.phonenum === null || req.body.phonenum === '') {
        res.json({ success: false, message: 'Ensure username, email, and password were provided' });
    } else {
        // Saving the new user to database
        user.save(function(err) {
            if (err) {
                console.log(err);
                // Check if any validation errors exists (from user model)
                if (err.errors != null)
                {
                    if (err.errors.email)    {
                        res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                    } else if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                    } else {
                        res.json({ success: false, message: err }); // Display any other errors with validation
                    }
                }
                else if (err) {
                    // Check if duplication error exists
                    if (err.code == 11000) {
                        if (err.errmsg[61] == "e") {
                            res.json({success: false, message: 'That e-mail is already taken'}); // Display error if e-mail already taken
                        } else {
                            res.json({success: false, message: "A user already exists with same details"});
                        }
                    } else {
                        res.json({ success: false, message: err }); // Display any other error
                    }
                }
            } else {
                // Create e-mail object to send to user
                var email = {
                    from:  'IEEE_VIT',
                    to: [user.email,  'abhilashg179@gmail.com'],
                    subject: 'Your Account is activated',
                    text: 'Hello ' + user.username + ', thank you for registering at IEEE_Conference. ',
                    html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Thank you for registering at IEEE_Conference'
                };
                // Function to send e-mail to the user
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: true, message: 'Account registered! ' }); // Send success message back
            }
        });
    }
});

// Route for user logins
router.post('/authenticate', function(req, res) {
    const loginUser = (req.body.email).toLowerCase(); // Ensure username is checked in lowercase against database
    User.findOne({ email: loginUser }).select('email password username qrcode phonenum permission appid').exec(function(err, user) {
        if (err) {
            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
            var email = {
                from: 'IEEE_VIT',
                to: ['abhilashg179@gmail.com'],
                subject: 'ERROR',
                text: 'Hello this error '+err,
                html: 'Hello this error '+err
            };
            // Function to send e-mail to myself
            client.sendMail(email, function(err, info) {
                if (err) {
                    console.log(err); // If error with sending e-mail, log to console/terminal
                } else {
                    console.log(info); // Log success message to console if sent
                }
            });
            res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our IEEE team. We apologize for this inconvenience!' });
        } else {
            // Check if user is found in the database (based on username)
            if (!user) {
                res.json({ success: false, message: 'Username not found' }); // Username not found in database
            } else if (user) {
                // Check if user does exist, then compare password provided by user
                if (!req.body.password) {
                    res.json({ success: false, message: 'No password provided' }); // Password was not provided
                }
                else {
                    var validPassword = user.comparePassword(req.body.password); // Check if password matches password provided by user
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate, password invalid' }); // Password does not match password in database
                    } else {
                        var token = jwt.sign({ username: user.username, email: user.email, phonenum:user.phonenum, permission:user.permission, qrcode:user.qrcode, appid:user.appid, food: user.food}, secret); // Create a token for activating account through e-mail
                        res.header("Set-Cookie", "x-access-token="+token);
                        res.json({ success: true, message: 'User authenticated!', token: token, user: user });    // Return token in JSON object to controller
                    }
                }
            }
        }
    });
});

module.exports = router;

