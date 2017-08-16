
module.exports = function (router) {

	router.route('/403')
		.get(function (req, res) {
			res.status(403)
			res.render('access-denied')
		})

	router.route('/404')
		.get(function (req, res) {
			res.status(404)
			res.render('not-found')
		})
		
	router.route('/405')
		.get(function (req, res) {
			res.status(405)
			res.render('password-fail')
		})
}