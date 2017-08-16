
////////////////////////////////////////////////////////////
// Import statements for modules and models
////////////////////////////////////////////////////////////

// Import express, mongoose, body parser and swig
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var swig = require('swig');
var https = require('https');
var request = require('request');
var path = require('path');

var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var db = require('./config/database.js');

var ConnectRoles = require('connect-roles');

var methodOverride = require('method-override');

// Import models for mongoose
var Stage = require('./models/Stage.js');
var Concert = require('./models/Concert.js');
var Band = require('./models/Band.js');
var Booking = require('./models/Booking.js');

var isLoggedIn = require('./config/passport_function.js');


////////////////////////////////////////////////////////////
// Initial setup for modules
////////////////////////////////////////////////////////////

var app = express();

// Connect to MongoDB at localhost
//mongoose.connect('mongodb://localhost/dicksuckingshit');
mongoose.connect(db.url);

require('./config/passport.js')(passport);

//app.use(morgan('dev'));
app.use(cookieParser());

// Setup for BodyParser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Set swig to be the standard template engine for express
// swig gets its' views from the ./views/ folder
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// Initial setup for Express Router
var router = express.Router();

router.use(function(req,res,next){
	// write request data to console for easier debugging
	var request_text = 'Request: '+req.protocol+'://'+req.hostname+'@'+req.ip+req.path;
	console.log(request_text);
  // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' || req.body._method == 'DELETE') {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE'
        // and set requested url to /user/12
        req.url = req.path

        console.log(JSON.stringify(req.body))
    }      

	// Ensure the jump to next
	next()
})

// setup for passport.js
app.use(session({secret: 'rainbowsandshit'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login in sessions
app.use(flash()); // use connect-flash for flash messages

// roles role initialization for connect-roles
var roles = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when 
    // user fails authorisation 
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied')
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

// Middleware for connect-roles
app.use(roles.middleware());

require('./config/roles.js')(roles)

app.use('/', router);

//Setup for using public directory with stylesheet, images, etc.
app.use(express.static(path.join(__dirname, 'public')));


app.use(methodOverride('_method'));

/*
// NOTE: when using req.body, you must fully parse the request body
//       before you call methodOverride() in your middleware stack,
//       otherwise req.body will not be populated.
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))*/


////////////////////////////////////////////////////////////
// Start of main body
// Express routing functions
////////////////////////////////////////////////////////////

router.get('/', isLoggedIn, function(req, res) {
	Concert.find(function(err, concerts){
		if (err){ res.send(err); }
		res.render('front', {concerts:JSON.stringify(concerts),user:req.user});
	});
});

require('./routes/api.js')(router,roles)
require('./routes/bands.js')(router,passport,isLoggedIn,roles)
require('./routes/bookings.js')(router,passport,isLoggedIn,roles)
require('./routes/concerts.js')(router,passport,isLoggedIn,roles)
require('./routes/stages.js')(router,passport,isLoggedIn,roles)
require('./routes/passport.js')(app,router,isLoggedIn,roles)
require('./routes/error.js')(router)

require('./routes/prototypes.js')





/*app.use(function (err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.render('not-found')
})*/

app.use(function (req, res, next) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    res.status(404)
    res.render('not-found')
  }
})

////////////////////////////////////////////////////////////
// Run Express server
////////////////////////////////////////////////////////////

// Select which port to run the server on
var port = 8000;

app.listen(port, function(){
	console.log('Express server running at port ' + port);
})

