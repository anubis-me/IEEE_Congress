/**
 * Created by abhi on 07-Feb-18.
 */
var User            = require('../models/user');    // Import User Model
var jwt             = require('jsonwebtoken');      // Import JWT Package
var secret          = 'harrypotterfdrtynbvrt';      // Create custom secret for use in JWT
var nodemailer      = require('nodemailer');        // Import Nodemailer Package
var sgTransport     = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package

module.exports = function(router) {

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
        user.permission   = req.body.permission; // Save permission from request to User object
        user.password     = req.body.password;   // Save password from request to User object
        user.email        = req.body.email;      // Save email from request to User object
        user.name         = req.body.name;       // Save name from request to User object
        user.phonenum     = req.body.name;       // Save phone number from request to User object
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret); // Create a token for activating account through e-mail

        // Check if request is valid and not empty or null
        if (req.body.name === null || req.body.name === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.permission === null || req.body.permission === ''|| req.body.phonenum === null || req.body.phonenum === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // Save new user to database
            user.save(function(err) {
                if (err) {
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null)
                    {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.phonenum.message }); // Display error in validation (username)
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
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
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
                        text: 'Hello ' + user.name + ', thank you for registering at IEEE_Conference. ',
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at IEEE_Conference'
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
        const loginUser = (req.body.username).toLowerCase(); // Ensure username is checked in lowercase against database
        User.findOne({ username: loginUser }).select('email password').exec(function(err, user) {
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
                            res.json({ success: false, message: 'Could not authenticate, password invalid ' }); // Password does not match password in database
                        } else {
                            var token = jwt.sign({ username: user.username, email: user.email }, secret); // Logged in: Give user token
                            res.json({ success: true, message: 'User authenticated!', token: token });    // Return token in JSON object to controller
                        }
                    }
                }
            }
        });
    });


    return router; // Return the router object to server
};
