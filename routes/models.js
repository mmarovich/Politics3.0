const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
	},
	password: {
		type: String,
	},
	firstName: {type: String, default: ""},
	lastName: {type: String, default: ""},
	location: {type: mongoose.Schema.Types.Mixed}
});

UserSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || '',
		location: this.location || ''
	};
}

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};