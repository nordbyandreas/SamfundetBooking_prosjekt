
var Stage = require('../models/Stage.js');
var Concert = require('../models/Concert.js');

var nimble = require('nimble');
//require('../config/passport.js')(passport);


////////////////////////////////////////////////////////////
// Routing functions for /stages/
////////////////////////////////////////////////////////////

module.exports = function(router,passport,isLoggedIn,user){

router.route('/stages')

	// POST function for /stages/
	.post(isLoggedIn, function(res,req){
		// On POST-recieve,
		

		// Add model variables for created Stage model
		// ......

		//Send JSON message back to client
		res.json({message:'Stage created!'})
	})

	// GET Function for /stages/
	.get(isLoggedIn, function(req,res){
		nimble.parallel([
			function(callback) {
				Stage.find(function(err, stages){
					if (err) {
						//res.send(err);
					}
					if (stages) {
						callback(null,stages)
					} else {
						callback(err)
					}
				})
			},

			function (callback) {
				Concert.find({}, function (err, concerts) {
					if (err) {
						//res.send(err)
					}
					if (concerts) {
						callback(null,concerts)
					} else {
						callback(err)
					}
				})
			}],

			function(err, results) {
				// Render found objects with swig and send to client 
				res.render('stage-table', {stages:results[0],concerts:results[1],title:'List of stages'});
			})
	});

router.route('/stage/:name')

	.get(isLoggedIn, function(req,res){
		nimble.parallel([
			function(callback) {
				Stage.findOne({'name':req.params.name})
		            .populate('bands')
		            .populate('concerts')
		            .exec(function(err,stage) {
		                if (err) {
		                	//res.send(err)
		                }
		                callback(err,stage)
		            })
			},

			function(callback) {
				Concert.find({})
					.populate('stage')
                    .populate('bands')
					.exec(function(err, concerts) {
						if (err) {
							//res.send(err)
						}
						if (concerts) {
							callback(err,concerts)
						}
					})
			}],

			function (err,results) {
				if (results[0]) {
					res.render('stage-info', {stage:results[0],concerts:results[1]})
				} else {
					res.render('not-found')
				}
			})

	})
	.delete(isLoggedIn, user.can('delete stage'), function(req, res) {
			Stage.findOneAndRemove({'name' : req.params.name}, function (err, stage) {
        		res.redirect('/stages')
      		})
		})

// Routing functions for /stages/create/
router.route('/stages/create')

	// POST function for /stages/create/
	.post(isLoggedIn, function(req,res){
		// On POST-recieve, create a Stage Object with body params from form

		var stage = new Stage({
				name: "",
				price: "",
				capacity: "",
				concerts: [],
				color:"",
                image:"",
			})

			Object.keys(req.body).forEach(function (key, index) {
				if ([key]in stage && req.body[key] != '') {
					if (typeof stage[key] != 'undefined' && stage[key].constructor === Array) {
						stage[key] = req.body[key].split(',')
					} else {
						stage[key] = req.body[key]
					}
				}
			})

			stage.save(function (err) {
				if (err) {
					res.send(err)
				} else {
					res.redirect('/stages')
				}
			})

		// Add model other variables for created Stage model
		// ......

		// Send redirect to newly created stage object
		//res.redirect('/stage/' + stage._id)
	})

	.get(isLoggedIn, function(req,res){
		res.render('stage-form',{});
	});

}