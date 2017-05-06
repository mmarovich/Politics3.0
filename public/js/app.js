var USERS_URL = 'mongodb://localhost/politics';
var CIVIC_CURL = 'https://www.googleapis.com/civicinfo/v2/representatives';

state = {
	loggedIn: false,
	user: null
}

function createAccount() {
	$('.createAccount').submit(function(e) {
		e.preventDefault();
		var username = $(this).find('#username2').val();
		var firstName = $(this).find('#firstName').val();
		var lastName = $(this).find('#lastName').val();
		var password = $(this).find('#password2').val();
		$.ajax({
			url: "/signup",
			method: "post",
			contentType: "application/json",
			data: JSON.stringify({
				username: username,
				firstName: firstName,
				lastName: lastName,
				password: password
			}),
			success: function(data) {
				state.user = {
					id: data.id,
					username: data.username,
					firstName: data.firstName,
					lastName: data.lastName,
					location: data.location
				}
				$('.createAccount').children('input').val('');
				$('.logIn').children('input').val('');
				$('.unBio > span').html(data.username);
				$('.fullNameBio > span').html(data.firstName + ' ' + data.lastName);
				$('.logOut').removeClass('hidden');
				state.loggedIn = true;
				createQueryHash('settings');
				$(window).trigger('hashchange');
				console.log('signup successful');
			},
			error: function() {
				console.log('post error');
			}
		})
	})
}

function logIn() {
	$('.logIn').submit(function(e) {
		e.preventDefault();
		var username = $(this).find('#username1').val();
		var password = $(this).find('#password1').val();
		$.ajax({
			url: "/login",
			method: "post",
			contentType: "application/json",
			data: JSON.stringify({
				username: username,
				password: password
			}),
			success: function(data) {
				state.user = {
					id: data.id,
					username: data.username,
					firstName: data.firstName,
					lastName: data.lastName,
					location: data.location
				}
				console.log(state.user.username);
				$('.createAccount').children('input').val('');
				$('.logIn').children('input').val('');
				$('.unBio > span').html(data.username);
				$('.fullNameBio > span').html(data.firstName + ' ' + data.lastName);
				$('.logOut').removeClass('hidden');
				state.loggedIn = true;
				createQueryHash('dash');
				$(window).trigger('hashchange');
				inputLocation(data.location);
				console.log('Login Successful')
			},
			error: function() {
				console.log('get error');
			}
		});
	});
};

function logOut() {
	$('.logOut').click(function(e) {
		e.preventDefault();
		
		$.ajax({
			url: "/logout",
			method: "get",
			success: function() {
				$('.logOut').addClass('hidden');
				createQueryHash('');
				state.loggedIn = false;
				$(window).trigger('hashchange');
				console.log('Have a nice day!');
			},
			error: function() {
				console.log('Logout error');
			}
		});
	})
}

// getDataFromApi is initiated from location inputs.
// locatons are initiated when the user changes location,
// and also when the user logs in after sign up.

function getDataFromApi(address, callback) {
	var query = {
		key: 'AIzaSyDV-hWlGqtJe9QnjQSlrFSgTqssSu0rre8',
		address: address
	}
	$.getJSON(CIVIC_CURL, query, callback).fail(function() {
		locationError();
	})
}

// data is generated by pulling from the Google Civics API.

function presidentData(data, i) {
	$('.president > .name > span').html(data.officials[data.offices[i].officialIndices[0]].name);
	$('.president > .party > span').html(data.officials[data.offices[i].officialIndices[0]].party);
	$('.president > .address > span').html(data.officials[data.offices[i].officialIndices[0]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[0]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[0]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[0]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].zip);
	$('.president > .phone > span').html(data.officials[data.offices[i].officialIndices[0]].phones[0]);
	$('.president > .website > a').html(data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '');
}

function vpData(data, i) {
	$('.vicePresident > .name > span').html(data.officials[data.offices[i].officialIndices[0]].name);
	$('.vicePresident > .party > span').html(data.officials[data.offices[i].officialIndices[0]].party);
	$('.vicePresident > .address > span').html(data.officials[data.offices[i].officialIndices[0]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[0]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[0]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[0]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].zip);
	$('.vicePresident > .phone > span').html(data.officials[data.offices[i].officialIndices[0]].phones[0]);
	$('.vicePresident > .website > a').html(data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '');
}

function senateData(data, i) {
	$('.senate1 > .name > span').html(data.officials[data.offices[i].officialIndices[0]].name);
	$('.senate1 > .party > span').html(data.officials[data.offices[i].officialIndices[0]].party);
	$('.senate1 > .address > span').html(data.officials[data.offices[i].officialIndices[0]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[0]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[0]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[0]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].zip);
	$('.senate1 > .phone > span').html(data.officials[data.offices[i].officialIndices[0]].phones[0]);
	$('.senate1 > .website > a').html(data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '');
	$('.senate2 > .name > span').html(data.officials[data.offices[i].officialIndices[1]].name);
	$('.senate2 > .party > span').html(data.officials[data.offices[i].officialIndices[1]].party);
	$('.senate2 > .address > span').html(data.officials[data.offices[i].officialIndices[1]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[1]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[1]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[1]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[1]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[1]].address[0].zip);
	$('.senate2 > .phone > span').html(data.officials[data.offices[i].officialIndices[1]].phones[0]);
	$('.senate2 > .website > a').html(data.officials[data.offices[i].officialIndices[1]].urls[0] ?
		data.officials[data.offices[i].officialIndices[1]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[1]].urls[0] ?
		data.officials[data.offices[i].officialIndices[1]].urls[0] : '');
}

function governorData(data, i) {
	$('.governor > .name > span').html(data.officials[data.offices[i].officialIndices[0]].name);
	$('.governor > .party > span').html(data.officials[data.offices[i].officialIndices[0]].party);
	$('.governor > .address > span').html(data.officials[data.offices[i].officialIndices[0]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[0]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[0]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[0]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].zip);
	$('.governor > .phone > span').html(data.officials[data.offices[i].officialIndices[0]].phones[0]);
	$('.governor > .website > a').html(data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '');
}

function mayorData(data, i) {
	$('.mayor > .name > span').html(data.officials[data.offices[i].officialIndices[0]].name);
	$('.mayor > .party > span').html(data.officials[data.offices[i].officialIndices[0]].party);
	$('.mayor > .address > span').html(data.officials[data.offices[i].officialIndices[0]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[0]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[0]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[0]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].zip);
	$('.mayor > .phone > span').html(data.officials[data.offices[i].officialIndices[0]].phones[0]);
	$('.mayor > .website > a').html(data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '');
}

function cityClerkData(data, i) {
	$('.cityClerk > .name > span').html(data.officials[data.offices[i].officialIndices[0]].name);
	$('.cityClerk > .party > span').html(data.officials[data.offices[i].officialIndices[0]].party);
	$('.cityClerk > .address > span').html(data.officials[data.offices[i].officialIndices[0]].address[0].line1 + '<br>' +
		(data.officials[data.offices[i].officialIndices[0]].address[0].line2 ? 
			data.officials[data.offices[i].officialIndices[0]].address[0].line2 + '<br>': '') +
		data.officials[data.offices[i].officialIndices[0]].address[0].city + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].state + '<br>' +
		data.officials[data.offices[i].officialIndices[0]].address[0].zip);
	$('.cityClerk > .phone > span').html(data.officials[data.offices[i].officialIndices[0]].phones[0]);
	$('.cityClerk > .website > a').html(data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '').attr("href", data.officials[data.offices[i].officialIndices[0]].urls[0] ?
		data.officials[data.offices[i].officialIndices[0]].urls[0] : '');
}

// This information is placed at the top of the dash to show
// the user their currently set location.

function locationData(data) {
	$('.results-for > p > span').html(data.normalizedInput.line1 + '<br>' + data.normalizedInput.city +
		', ' + data.normalizedInput.state + ' ' + data.normalizedInput.zip)
}

function locationError(){
	$('.location > span').html('USA location not recognized.  Please try again.');
}

// displayData is initiated by when user changes their location or logs in.

function displayData(data) {
	console.log(state);
	$.ajax({
			url: "/location/" + state.user.id,
			method: "put",
			contentType: "application/json",
			data: JSON.stringify({
				user: state.user,
				location: data.normalizedInput
			}),
			success: function() {
				console.log('location updated');
			},
			error: function() {
				console.log('get error');
			}
		});

		locationData(data);

	for (i=0;i< data.offices.length;i++) {
		if (data.offices[i].name === "President of the United States") {
			presidentData(data, i);
		}
		if (data.offices[i].name === "Vice-President of the United States") {
			vpData(data, i);
		}
		if (data.offices[i].name === "United States Senate") {
			senateData(data, i);
		}
		if (data.offices[i].name === "Governor") {
			governorData(data, i);
		}
		if (data.offices[i].name === "Mayor") {
			mayorData(data, i);
		}
		if (data.offices[i].name === "City Clerk") {
			cityClerkData(data, i);
		}
	}
	createQueryHash('dash');
	$(window).trigger('hashchange');
};

// grabs user location from database when they log in.

function inputLocation(location) {
	console.log(state.user);
	if (!location) {
		$('.info > span').html('information not available');
	} else {
		var address = location.city + " " + location.line1 + " " + location.state + " " + location.zip;
		getDataFromApi(address, displayData);
	}
}

// grabs user location when they change it in the settings.

function setLocation() {
	$('.location').submit(function(e) {
		console.log(state.user);
		e.preventDefault();
		$('.location > span').html("");
		$('.info > span').html('information not available');
		var address = $(this).find('.address').val();
		$('#location')[0].reset();
		
		getDataFromApi(address, displayData);
	});
};

// these functions control which portion of the SPA the user sees.

function createQueryHash(view){

    // Here we check if filters isn't empty.
    if(!$.isEmptyObject(view)){
      // Stringify the object via JSON.stringify and write it after the '#filter' keyword.
      window.location.hash = '#' + view;
    }
    else{
      // If it's empty change the hash to '#' (the homepage).
      window.location.hash = '';
    }

  }




function render(url) {

		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.page').addClass('hidden');

		var map = {

			// The Homepage.
			'': function() {
					$('.userAccounts').removeClass('hidden');
				// Clear the filters object, uncheck all checkboxes, show all the products

				// renderProductsPage(products);
			},

			// Single Products page.
			'#settings': function() {
					$('.settings').removeClass('hidden');
					// $('.userAccounts').addClass('hidden');
				// Get the index of which product we want to show and call the appropriate function.
				// var index = url.split('#product/')[1].trim();

				// renderSingleProductPage(index, products);
			},

			// Page with filtered products
			'#dash': function() {
					$('.dash').removeClass('hidden');
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				// url = url.split('#filter/')[1].trim();

				// Try and parse the filters object from the query string.
				// try {
				// 	filters = JSON.parse(url);
				// }
				// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
				// catch(err) {
				// 	window.location.hash = '#';
				// }

				// renderFilterResults(filters, products);
			}

		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}

	}




$(function() {
	createAccount();
	logIn();
	logOut();
	setLocation();
	$(window).on('hashchange', function(){
		// On every hash change the render function is called with the new hash.
		// This is how the navigation of our app happens.
		render(decodeURI(window.location.hash));
	});
});