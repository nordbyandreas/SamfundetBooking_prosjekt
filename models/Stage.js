
var mongoose = require('mongoose');
var shortid = require('shortid')

var Band = require('./Band.js')
var Concert = require('./Concert.js')
var Booking = require('./Booking.js')

var StageSchema = new mongoose.Schema({
	name: String,
	price: String,
	capacity: String,
	concerts: [String],
	color:String,
    image:String,
	bands:[{type: mongoose.Schema.ObjectId, ref: 'Band'}],
	Concerts:[{type: mongoose.Schema.ObjectId, ref: 'Concert'}],
	bookings:[{type: mongoose.Schema.ObjectId, ref: 'Booking'}],
});

module.exports = mongoose.model('Stage', StageSchema);