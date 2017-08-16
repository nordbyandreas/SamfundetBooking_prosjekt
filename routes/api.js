
var Concert = require('../models/Concert.js')
var Stage = require('../models/Stage.js')
var Band = require('../models/Band.js')
var Booking = require('../models/Booking.js')

////////////////////////////////////////////////////////////
// Routing functions for /api/
// The API is used to give frontend access to database information
// with read-only access to the models and other information we choose
////////////////////////////////////////////////////////////

module.exports = function (router) {

	router.route('/api')
		.get(function(req,res){
			res.send("This is our API page, it should be free to use to get information")
		})

	router.route('/api/concerts')
		.get(function(req,res){
			Concert.find()
				.populate('stage')
				.populate('bands')
				.exec(function (err, concerts) {
				if (err) {
						res.send(err)
					}
					if (['band','manager'].indexOf(req.user.role) > -1) {

						for (var i = 0; i<concerts.length; i++) {
							concerts[i].bands = concerts[i].bands.map((b) => b.id)
						}
						concerts = concerts.filter((a) => a.bands.indexOf(req.user.connected_band) > -1)
						res.json(concerts)

					} else {
						res.json(concerts)
					}
				})
		})

	router.route('/api/concert/:name')
		.get(function (req, res) {
			Concert.findOne({'name':req.params.name})
				.populate('stage')
				.populate('bands')
				.populate('host')
				.populate('crew')
				.exec(function (err, concert) {
					if (err) {
						res.send(err)
					}
					res.json(concert)
				})
		})

	router.route('/api/stages')
		.get(function(req,res){
			Stage.find()
				.populate('bands')
				.populate('concerts')
				.exec(function (err, stages) {
					if (err) {
						res.send(err)
					}
					res.json(stages)
				})
		})

	router.route('/api/stage/:name')
		.get(function (req, res) {
			Stage.findOne({'name':req.params.name})
				.populate('bands')
				.populate('concerts')
				.exec(function (err, stage) {
					if (err) {
						res.send(err)
					}
					res.json(stage)
				})
		})

	router.route('/api/bookings')
		.get(function(req,res){
			Booking.find()
				.populate('band')
				.exec(function (err, bookings) {
					if (err) {
						res.send(err)
					}
					if (['band','manager'].indexOf(req.user.role) > -1) {


						bookings = bookings.filter((a) => a.band.id == req.user.connected_band)

						console.log(bookings)

						res.json(bookings)
						
					} else {
						res.json(bookings)
					}
				})
		})

	router.route('/api/booking/:url')
		.get(function (req, res) {
			Booking.findOne({'url':req.params.url})
				.populate('band')
				.exec(function (err, booking) {
					if (err) {
						res.send(err)
					}
					res.json(booking)
				})
		})

	router.route('/api/bands')
		.get(function(req,res){
			Band.find()
				.populate('concerts')
				.populate('bookings')
				.populate('stages')
				.exec(function (err, bands) {
					if (err) {
						res.send(err)
					}
					res.json(bands)
				})
		})

	router.route('/api/band/:name')
		.get(function (req, res) {
			Band.findOne({'name':req.params.name})
				.populate('concerts')
				.populate('bookings')
				.populate('stages')
				.exec(function (err, band) {
					if (err) {
						res.send(err)
					}
					res.json(band)
				})
		})
}