const {BasicStrategy} = require('passport-http');
const {User} = require('../routes/models');

module.exports = function(passport) {

	passport.serializeUser(function(user, cb) {
		console.log(user, "serialize")
  		cb(null, user)
		});

	passport.deserializeUser(function(obj, cb) {
		console.log(obj, "deserialize")
  		cb(null, obj)
	});

	const basicStrategy = new BasicStrategy({usernameField: "username"}, function(username, password, callback) {
	let user;
	User
		.findOne({username: username})
		.exec()
		.then(_user => {
			user = _user;
			if (!user) {
				return callback(null, false, {message: 'Incorrect username'});
			}
			return user.validatePassword(password);
		})
		.then(isValid => {
			if (!isValid) {
				return callback(null, false, {message: "Incorrect password"});
			}
			else {
				return callback(null, user)
			}
		});
	});
}