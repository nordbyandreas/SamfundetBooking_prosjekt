
var mongoose = require('mongoose')
var shortid = require('shortid')

var Stage = require('./Stage.js')
var Band = require('./Band.js')
var Booking = require('./Booking.js')
var User = require('./user.js')

var ConcertSchema = new mongoose.Schema({
	name: String,
	genre: String,
	bands: [{type: mongoose.Schema.ObjectId, ref: 'Band'}],
	stage: {type: mongoose.Schema.ObjectId, ref: 'Stage'},
	bookings: [{type: mongoose.Schema.ObjectId, ref: 'Booking'}],
	audSize: Number,
 	date: String,
	time: String,
	practice_time: String,
	technicals: String,
	host: {type: mongoose.Schema.ObjectId, ref: 'User'},

	crew: [{type: mongoose.Schema.ObjectId, ref: 'User'}],

	ticketPrice: Number,
	expenses: Number,
	revenue: Number,

	bandIDs: Array, //Will contain the database ID's for the bands, if they exist
});

module.exports = mongoose.model('Concert', ConcertSchema)