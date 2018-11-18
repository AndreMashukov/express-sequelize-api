let request = require('supertest');
var superagent = require('superagent');
var agent = superagent.agent();
const CONFIG = require('./../config/config');

var theAccount = {
	email: 'andre.mashukov@gmail.com',
	password: '111111'
};

var token;

request = request('http://localhost:' + CONFIG.port);

describe('Get User', () => {

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

	it('Should return 200 response code', (done) => {
		request
			.get('/v1/users')
			.send(agent)
			.set('Accept', 'application/json')
			.set('Authorization', token)
			.expect(200, done);
	});
});