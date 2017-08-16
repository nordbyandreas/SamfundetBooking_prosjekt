
//require('../config/passport.js')(passport);


var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var ensureLogin = require('connect-ensure-login')

var User = require('../models/user.js')

module.exports = function(app,router,isLoggedIn,user){

	////////////////////////////////////////////////////////////
	// Login
	////////////////////////////////////////////////////////////
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successReturnToOrRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));
		
	////////////////////////////////////////////////////////////
	// Signup
	////////////////////////////////////////////////////////////
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.html', { message: req.flash('signupMessage') });
	});

	// process the signup form
	//app.post('/signup', passport.authenticate('local-signup', {
	//	successRedirect : '/users',
	//	failureRedicret : '/signup',
	//	failureFlash : true
	//}));
	router.route('/signup')
	.post(function (req, res) {
		console.log(req);
		var newUser = new User();
		newUser.local.username = req.body.username
		newUser.local.password = newUser.generateHash(req.body.password)
		newUser.fullname = req.body.fullname
		newUser.role = req.body.role
		newUser.save()
		res.redirect('/users')
	})

	////////////////////////////////////////////////////////////
	// Logout
	////////////////////////////////////////////////////////////
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

		
	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/login');
	}

	router.route('/profile')
		.post(isLoggedIn,function(req,res){
			User.findById(req.user._id, function(err,data){
				if (err){ res.send(err); }
				else {
					data.role = req.body.role
					data.save()
					res.redirect('/')
				}
			})
		})
		.get(isLoggedIn,function(req,res){
			User.findById(req.user._id, function(err,data){
				if (err){ res.send(err); }
				else {
					res.render('profile-edit',{user:data})
				}
			})
		})

	router.route('/users')
		.get(isLoggedIn, user.is('admin'), function (req, res) {
			User.find()
				.populate('connected_band')
				.exec(function (err, users) {
					res.render('user-table',{users:users})
				})
		})

	router.route('/user/:user_id')
		.get(isLoggedIn, user.is('admin'), function (req, res) {
			User.findById(req.params.user_id).populate('connected_band').exec(function (err, _user) {
				res.json(_user)
			})
		})
		.delete(isLoggedIn, user.is('admin'), function (req, res) {
			User.findByIdAndRemove(req.params.user_id, function (err, _user) {
				res.redirect('/users')
			})
		})
		
		router.route('/changepass')
		.post(isLoggedIn, function (req, res) {
			User.findById(req.user._id, function (err, data) {
				if (err) { res.send(err); }
				
				if (req.body.password_new !== req.body.password_new_confirm) {
						res.redirect('/405')
					} else {
						data.local.password = data.generateHash(req.body.password_new)
						data.save()
						res.redirect('/')
					}
				})
			})
}
