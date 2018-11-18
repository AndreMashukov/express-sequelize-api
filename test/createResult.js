let request = require('supertest');
var superagent = require('superagent');
var agent = superagent.agent();
const CONFIG = require('./../config/config');

var theAccount = {
	email: 'andre.mashukov@gmail.com',
	password: '111111'
};

var result = {
	data: {
		field1: 'Field 1',
		field2: 'Field 2'
	}
};

var token;

request = request('http://localhost:' + CONFIG.port);

describe('Create Result', () => {
	before(function (done) {
		agent = superagent.agent();
		request
		  .post('/v1/users/login')
		  .send(theAccount)
		  .end(function (err, res) {
			if (err) {
			  throw err;
			}
			
			token = res.body.token;
			done();
		  });
	  });

	it('Should return 201 response code', (done) => {
		request
			.post('/v1/results')
			.send(result)
			.set('Accept', 'application/json')
			.set('Authorization', token)
			.expect(201, done);
	});
});