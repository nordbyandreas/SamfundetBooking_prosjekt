
var mongoose = require('mongoose');
var shortid = require('shortid');
var User = require('./user.js');
var Booking = require('./Booking.js')
var Concert = require('./Concert.js')
var Stage = require('./Stage.js')

var BandSchema = new mongoose.Schema({
	name:String,
	members:[String],
	description: String,
	previous_concerts:[String],
	album_sales:[String],
	bookings:[{type: mongoose.Schema.ObjectId, ref: 'Booking'}],
	concerts:[{type: mongoose.Schema.ObjectId, ref: 'Concert'}],
	stages:[{type: mongoose.Schema.ObjectId, ref: 'Band'}],

	connected_user: {type:mongoose.Schema.ObjectId,ref:'User'},
	connected_manager: {type:mongoose.Schema.ObjectId,ref:'User'},

	spotify_id:String,
	spotify_followers:String,
	spotify_genres:[String],
	spotify_popularity:String,
	spotify_image:String,
	spotify_albums: Object,
	spotify_top_tracks: Object,

	external_urls: [String],

	lastfm_listeners: String,
	lastfm_playcount: String,
});

module.exports = mongoose.model('Band', BandSchema);
