
var Concert = require('../models/Concert.js')
var Band = require('../models/Band.js')
var Stage = require('../models/Stage.js')
var Booking = require('../models/Booking.js')
//require('../config/passport.js')(passport);
var nimble = require('nimble')
var replaceAll = require('./prototypes.js')
var mongoose = require('mongoose')

var moment = require('moment')

var User = require('../models/user.js')

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement)
}

////////////////////////////////////////////////////////////
// Routing functions for /concerts/
////////////////////////////////////////////////////////////

module.exports = function (router, passport, isLoggedIn, user) {
	router.route('/concerts')

		// GET Function for /concerts/
		.get(isLoggedIn, function(req ,res) {

			// Nimble lets you run several functions asyncronously and return the results in an array
			// It takes the functions as an array and resturns the result arranged at the same indexes
			// Nimble takes two parameters, the array of functions, and the function to handle the results
			nimble.parallel ([
				function (callback) {
					Concert.find()
						.populate('stage')
						.populate('bands')
						.populate('host')
						.populate('crew')
						.exec(function(err, concerts){
							if (err) {
								res.send(err)
							}
              if (req.user.role == 'crew') {

                concerts = concerts.filter(concert => req.user.concerts.indexOf(concert.id) > -1)
              }
							callback(err, concerts)

						})
				},

				function (callback) {
					Stage.find(function (err, stages) {
						if (err) {
							res.send(err)
						}
						callback(err, stages)
					})
				}],

				// after the array of functions is finished, this function is run with the results of them
				function (err, results) {
					info = {
						concerts:results[0],
						title:'List of concerts',
						stages:results[1]
					}
					res.render('concert-table', info)
				}
			)
		})

	router.route('/concert/:name')

		.get(isLoggedIn, function (req, res) {

			Concert.findOne({'name':req.params.name})
				.populate('stage')
				.populate('bands')
				.populate('host')
				.populate('crew')
				.exec(function (err, concert) {
					if (err) {
						res.send(err)
					}
					if (concert) {
						res.render('concert-info', {concert:concert});
						console.log('shit u want to see: ' + concert.host);
					} else {
						res.render('not-found')
					}
			})
		})
		.delete(isLoggedIn, user.can('delete concert'), function (req, res) {
				Concert.findOneAndRemove({'name' : req.params.name}, function (err, concert) {
	        		res.redirect('/concerts')
	      		})
			})

	//Routing function for editing concert
	router.route('/concert/:name/edit')

		// POST function for this route, on recieve edited object via form
		.post(isLoggedIn, function (req, res) {

			Concert.findOne({'name':req.params.name}, function (err, concert) {
				if (err) {
					res.send(err)
				}
				if (concert) {

					// iterate over keys in recieved form, and if anything is edited, change information in object in database
					Object.keys(req.body).forEach( function (key, index) {
						if ([key]in concert && req.body[key] != '') {
							if (typeof concert[key] != "undefined" && concert[key].constructor === Array && req.body[key].constructor !== Array) {
								concert[key] = req.body[key].split(',')
							} else {
								concert[key] = req.body[key]
							}
						}
					});
					// After edit, save and redirect to objects' page again, else send error
					concert.save(function(err){
						if (err) {
							res.send(err)
						} else {
							//res.redirect('/concert/' + req.params.name)

							//There is no dedicated concert page, therefore redirecting to the table
							res.redirect('/concerts')
						}
					})
				} else {
					// if for some reason the edited object is not found, send 404
					res.render('not-found')
				}
			})
		})



		// Find object in database by id and render edit page for object type if found.
		// If not found, send 404
		.get(isLoggedIn, function(req, res) {

			nimble.parallel ([
				function (callback) {
					Concert.findOne({'name':req.params.name}).populate("bands").exec(function(err, concert) {
						if (err) {
							res.send(err)
						}
						callback(err,concert)
					})
				},

				function (callback) {
					Stage.find(function (err, stages) {
						if (err) {
							res.send(err)
						}
						callback(err, stages)
					})
				},
				function (callback) {
					Band.find(function (err, bands) {
						if (err) {
							res.send(err)
						}
						callback(err, bands)
					})
				},
				function (callback) {
					User.find().populate('host').exec(function (err, users) {
						if (err) {
							res.send(err)
						}
						callback(err, users)
					})
				},
				function (callback) {
					User.find(function (err, crews) {
						if (err) {
							res.send(err)
						}
						console.log(crews);
						let selected_crew = crews.filter(a => a.role === 'crew')
						console.log(selected_crew)
						callback(err, selected_crew)
					})
				}],

				// after the array of functions is finished, this function is run with the results of them
				function (err, results) {

					res.render('concert-edit', {concert:results[0],stages:results[1],bands:results[2], users:results[3], crews:results[4]})
				}
			)

		})
		.delete(isLoggedIn, user.can('delete concert'), function(req, res) {
				Concert.findOneAndRemove({'name' : req.params.name}, function (err, concert) {
	        		res.redirect('/concerts')
	      		})
			})




	// Routing functions for /concerts/create/
	router.route('/concerts/create')

		// POST function for /concerts/create/
		.post(isLoggedIn, function (req, res) {

			//console.log('BODY: ' + JSON.stringify(req.body))

			//console.log('SHORTID: ' + req.body.stage + '  ||  ISVALID: ' + mongoose.Types.ObjectId.isValid(req.body.stage))

			// On POST-recieve, create a Concert Object with body params from form
			var reqbands = []
			var reqbookings = []
			var reqcrew = []
			console.log('host is: ' + req.body.host);
			console.log('crew is: ' + req.body.crew);
			console.log('crew length is ' + req.body.crew.length);
			console.log(req.body)

			//console.log('RE BOOKING CONSTRUCTOR: ' + Array.isArray(req.body.booking))

			if (!Array.isArray(req.body.booking)) {
				var booking_band = req.body.booking.split(',')
				reqbookings.push(booking_band[0])
				reqbands.push(booking_band[1])
			} else {
				for (var i = 0; i<req.body.booking.length; i++) {
					//console.log('REQ BOOKINGS: '+req.body.booking)
					var booking_band = req.body.booking[i].split(',')
					reqbookings.push(booking_band[0])
					reqbands.push(booking_band[1])
				}
			}


			var concert = new Concert({
				name:req.body.name,
				bookings: reqbookings,
				bands: reqbands,
				genre: req.body.genre,
				stage: req.body.stage,
				audSize: req.body.audSize,
				date:req.body.date,
				time:req.body.time,
				practice_time:req.body.practice_time,
				ticketPrice: req.body.ticketPrice,
				expenses: req.body.expenses,
				revenue: 0,
				host: req.body.host,
				crew: req.body.crew


				//bandIDs:[],
				//genres:req.body.genres.replaceAll(' ','').split(','),
			})



			//There is no dedicated concert page, therefore redirecting to the table

			Booking.find({'_id': { $in: concert.bookings }}, function (err, bookings) {
				for (var i = 0; i<bookings.length; i++) {
					console.log('ITERERER Bookings')
					bookings[i].concert_created = true
					bookings[i].save(function (err) {
						console.error(err)
					})
				}
			})

			Band.find({'_id': { $in: concert.bands }}, function (err, bands) {
				for (var i = 0; i<bands.length; i++) {
					console.log('ITERERER BAND')
					bands[i].concerts.push(concert._id)
					bands[i].save(function (err) {
						console.error(err)
					})
				}
			})

			User.find({'_id': {$in: concert.crew}}, function (err, crew) {
				for (var i = 0; i<crew.length; i++) {
					console.log('ITERERER CREW')
					crew[i].concerts.push(concert._id)
					crew[i].save(function (err) {
						console.log(err);
					})
				}
			})

			Stage.findOne({'_id':concert.stage}, function (err, stage) {
				stage.concerts.push(concert._id)
				for (var i = 0; i<concert.bands.length; i++) {
					stage.bands.push(concert.bands[i])
				}
				stage.save(function (err) {
					console.error(err)
				})
			})

			concert.save(function (err) {
				if (err) {
					console.error(err)
				} else {
					console.log('Concert saved!')
				}
			})
			res.redirect('/concerts');
		})

		.get(isLoggedIn, function (req, res) {

			nimble.parallel ([

				function (callback) {

					Booking.find()
					.populate('band')
					.populate('stage')
					.exec(function(err, bookings) {

						if (err) {
							res.send(err)
						}

						let bookings_by_date = {}

						bookings = bookings.sort((a,b) => new Date(a.date) - new Date(b.date))

						for (let i = 0; i<bookings.length; i++) {
							let booking = bookings[i]
							booking.date = moment(booking.date).format('D. MMMM YYYY')
							if (!bookings_by_date.hasOwnProperty(booking.date) && booking.approval) {
								bookings_by_date[booking.date] = []
							}
							if (booking.approval) {
								bookings_by_date[booking.date].push(booking)
							}
						}

						callback(err,bookings_by_date)
					})
				},

				function (callback) {
					Stage.find().populate('Stage').exec(function (err, stages) {
						if (err) {
							res.send(err)
						}
						callback(err, stages)
					})
				},


				function (callback) {
					User.find().populate('host').exec(function (err, users) {
						if (err) {
							res.send(err)
						}
						callback(err, users)
					})
				},
				function (callback) {
					User.find(function (err, crews) {
						if (err) {
							res.send(err)
						}
						console.log(crews);
						let selected_crew = crews.filter(a => a.role === 'crew')
						console.log(selected_crew)
						callback(err, selected_crew)
					})
				}],


				function (err, results) {
					info = {
						bookings:results[0],
						stages:results[1],
						users:results[2],
						crews:results[3]
					}
					res.render('concert-form', info)
				}

			)
		})
}

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
