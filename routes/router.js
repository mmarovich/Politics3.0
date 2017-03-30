
module.exports = function(app, passport, path) {

	app.get('/', (req, res) => {
		if (req.isAuthenticated()) {
			res.sendFile(path.resolve(__dirname + '/../public/views/app.html'));
		} else {
			res.sendFile(path.resolve(__dirname + '/../public/views/login.html'));
		}
	});

	app.post('/signup', (req, res) => {
		if (!req.body) {
			return res.status(400).json({message: 'No request body'});
		}

		if (!('username' in req.body)) {
			return res.status(422).json({message: 'Missing field: username'});
		}

		let {username, password, firstName, lastName} = req.body;

		if (typeof username !== 'string') {
			return res.status(422).json({message: 'Incorrect field type: username'});
		}

		username = username.trim();

		if (username === '') {
			return res.status(422).json({message: "Incorrect field length: username"});
		}

		if (!(password)) {
			return res.status(422).json({message: 'Missing field: password'});
		}

		if (typeof password !== 'string') {
			return res.status(422).json({message: 'Incorrect field type: password'});
		}

		password = password.trim();

		if (password === '') {
			return res.status(422).json({message: 'Incorrect field length: password'});
		}

		return User
			.find({username})
			.count()
			.exec()
			.then(count => {
				if (count > 0) {
					return res.status(422).json({message: 'username already taken.  Sorry.'});
				}

				return User.hashPassword(password)
			})
			.then(hash => {
				return User
					.create({
						id: this._id,
						username: username,
						password: hash,
						firstName: firstName,
						lastName: lastName
					})
			})
			.then(user => {
				req.logIn(user, function (error) {
		          if (error) {
		            return next(error)
		          } else {
		           	res.sendFile(path.resolve(__dirname + '/../public/views/app.html'));
		          }
		        })
				// return res.status(201).json(user.apiRepr());
			})
			.catch(err => {
				res.status(500).json({message: 'Internal server error'});
			});
});


}
