var supertest = require('supertest');
var assert = require('assert');
const CONFIG = require('./../config/config');

describe('Creating a new user', function() {
	let user = {};
	var agent = supertest.agent('http://localhost:' + CONFIG.port);
	
	before((done) => {
		user = {
			email: 'andre.mashukov@gmail.com',
			password: '111111',
			firstname: 'Andrey',
			lastname: 'Mashukov',
			policy_code: 'PC123456',
			dob: '1982-07-20'
		};
		done();
	});
	
	it('Returns a 201 response code', function(done) {
		agent
			.post('/v1/users')
			.send(user)
			.expect(201, done);
	});
});