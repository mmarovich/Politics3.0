const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
chai.use(chaiHttp);
const {User} = require('../routes/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config/database');


function seedUserData() {
	console.log('seeding user data');
	const seedData = [];

	for (let i=1; i<=10;i++) {
		seedData.push(generateUserData());
	}

	return User.insertMany(seedData);
}

function generateUserData() {
	return {
		username: faker.internet.userName(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		password: faker.internet.password()
	}
}

function tearDownDb() {
	console.log('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Users source', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedUserData();
	})

	afterEach(function() {
		return tearDownDb();
	})

	after(function() {
		return closeServer();
	});

	describe('GET root endpoint', function() {

		it('should return status 200 on GET', function() {

			return chai.request(app)
			.get('/')
			console.log('got')
			.then(function(res) {
				res.should.have.status(200);
			});
		});
	});

	describe('POST endpoint', function() {

		it('should create new user account', function() {
			const newUser = generateUserData();
			return chai.request(app)
			.post('/signup')
			.send(newUser)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys(
					'id',
					'username',
					'firstName',
					'lastName'
				);
				res.body.id.should.not.be.null;
				res.body.username.should.equal(newUser.username);
				res.body.firstName.should.equal(newUser.firstName);
				res.body.lastName.should.equal(newUser.lastName);
			})
		})
	})

	describe('PUT endpoint', function() {

		it('should update fields sent over', function() {
			const updateData = {
				location: faker.address.city() + " " + faker.address.state()
			};

			return User
				.findOne()
				.exec()
				.then(user => {
					updateData.id = user._id;

					return chai.request(app)
					.put(`/location/${user._id}`)
					.send(updateData);
				})
				.then(res => {
					res.should.have.status(204);

					return User.findById(updateData.id).exec();
				})
				.then(user => {
					user.location.should.equal(updateData.location);
				});
		});
	});

	describe('GET logout endpoint', function() {
		it('should log out user', function() {
			return chai.request(app)
			.get('/logout')
			.then(function(res) {
				res.should.have.status(200);
			});
		})
	})

	// describe('DELETE endpoint', function() {
	// 	it('should delete user account', function() {
	// 		let user;

	// 		return User
	// 			.findOne()
	// 			.exec()
	// 			.then(function(_user) {
	// 				user = _user;
	// 				return chai.request(app).delete(`/users/${user._id}`);
	// 			})
	// 			.then(function(res) {
	// 				res.should.have.status(204);
	// 				return User.findById(user._id).exec();
	// 			})
	// 			.then(function(_user) {
	// 				should.not.exist(_user);
	// 			});
	// 	})
	// })
});