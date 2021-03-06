const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config/database.js');

app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport)

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    name: 'Session',
    resave: true,
    saveUninitialized: true,
    secret: 'forty-two',
    store: new MongoStore({
      url: DATABASE_URL,
      autoReconnect: true
    })
}))
app.use(passport.initialize());
app.use(passport.session());

require('./routes/router.js')(app, passport, path);

let server;

function runServer(database=DATABASE_URL, port=PORT) {
return new Promise((resolve, reject) => {
    mongoose.connect(database, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
};

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					console.log(`closeServer error, ${err}`);
					return reject(err);
				}
				resolve();
			});
		});
	});
};

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};