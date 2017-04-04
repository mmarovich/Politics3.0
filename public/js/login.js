var USERS_URL = 'mongodb://localhost/politics';

function createAccount() {
	$('.createAccount').submit(function(e) {
		e.preventDefault();
		var username = $(this).find('.usernameCreate').val();
		var firstName = $(this).find('.firstName').val();
		var lastName = $(this).find('.lastName').val();
		var password = $(this).find('.passwordCreate').val();
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
				console.log('Signup Successful')
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
		var username = $(this).find('.username').val();
		var password = $(this).find('.password').val();
		$.ajax({
			url: "/login",
			method: "post",
			contentType: "application/json",
			data: JSON.stringify({
				username: username,
				password: password
			}),
			success: function(data) {
				console.log('Login Successful')
			},
			error: function() {
				console.log('get error');
			}
		});
	});
};

$(function() {
	createAccount();
	logIn();
});