const { User } = require('./models');

module.exports = function(app, passport, path) {

	app.get('/', (req, res) => {
		if (req.isAuthenticated()) {
			res.sendFile(path.resolve(__dirname + '/../public/views/app.html'));
		} else {
			res.sendFile(path.resolve(__dirname + '/../public/views/app.html'));
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
						username: username,
						password: hash,
						firstName: firstName,
						lastName: lastName,
						location: ''
					})
			})
			.then(user => {
				req.logIn(user, function (error) {
		          if (error) {
		            return next(error)
		          } else {
		           	res.status(201).json(user.apiRepr());
		          }
		        })
			})
			.catch(err => {
				res.status(500).json({message: 'Internal server error'});
			});
	});

	app.post('/login',
		passport.authenticate('local', {session: true}),
	  	function(req, res) {
	  		if (!req.user) {
				return res.status(500).send(err);
	  		} else {
				res.status(201).json(req.user.apiRepr());
	  		}
		});

	app.get('/logout', (req, res) => {
		req.logout();
		req.session.destroy(function (err) {
			res.status(302).redirect('/');
		});
	})

	app.put('/location/:id', (req, res) => {
		User
		.findOne(
			{_id: req.params.id}
		).exec(function (err, data) {
			if(err) {
				return res.status(500).send(err);
			}
			if (!data) {
				return res.status(400).send();
			}
			data.location = req.body.location;
			data.save();
			res.status(204).send();
		})
	})

	
}
