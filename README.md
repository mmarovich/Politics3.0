#Political Hub

[Live Demo](https://politics3.herokuapp.com/)

`````
This is a prototype for finding your local, state, and federal representatives.  
It works in conjuction with Google's Civics API to present dynamic data including
who the representatives are, their role, and their contact information.

`````
Structure

languages and frameworks include:

- HTML/CSS
- Javascript
- Node.js

A server is set up with express using mongoose with a user database and testing database.

All passwords are hashed using bcrypt, and authentication is handled with passport.
Tests are done with mocha and chai.
