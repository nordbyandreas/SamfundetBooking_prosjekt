// app/models/user.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Band = require('./Band.js');

// define the schema for our user model
var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	},
	role:String,
	connected_band: {type:mongoose.Schema.ObjectId,ref:'Band'},
	concerts: [{type:mongoose.Schema.ObjectId, ref:'Concert'}],
	fullname: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);