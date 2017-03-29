exports.DATABASE_URL = process.env.DATABASE_URL ||
						global.DATABASE_URL ||
						'mongodb://mmarovich:12345@ds145289.mlab.com:45289/users-politics';
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://mmarovich:12345@ds145379.mlab.com:45379/test-politics');
exports.PORT = process.env.PORT || 8080;