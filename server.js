const express           = require('express');
const requestLogger     = require('morgan');
const bodyParser        = require('body-parser');
const expressValidator  = require('express-validator');
const compression       = require('compression');
const helmet            = require('helmet');
const mongoose          = require('mongoose');
const router            = express.Router();                 // Invoke the Express Router
const appRoutes         = require('./routes/api')(router);  // Import the application end points/API
const port              = process.env.PORT || 4000;         // Set default port or assign a port in environment
const app               = express();

require('dotenv').config();

mongoose.connect(process.env.DB_HOST, function(err) {

    if (err) {
        console.log('Not connected to the database: ' + err); // Log to console if unable to connect to database
    }
    else {
        console.log('Successfully connected to DB'); // Log to console if able to connect to database

        app.use(requestLogger('short'));
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(expressValidator());
        app.use(compression());
        app.use('/api', appRoutes);

        // Start Server
        app.listen(port, function() {
            console.log('Running the server on port ' + port); // Listen on configured port
        });
    }
});

