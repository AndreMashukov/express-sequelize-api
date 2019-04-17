let request = require('supertest');
const superagent = require('superagent');
let agent = superagent.agent();
const CONFIG = require('./../config/config');

const theAccount = {
  email: 'andre.mashukov@gmail.com',
  password: '111111',
};

let token;

request = request('http://localhost:' + CONFIG.port);

describe('Get Results', () => {
  before(function(done) {
    agent = superagent.agent();
    request.post('/v1/users/login').send(theAccount).end(function(err, res) {
      if (err) {
        throw err;
      }

      token = res.body.token;
      done();
    });
  });

  it('Should return 200 response code', (done) => {
    request
        .get('/v1/results')
        .send(agent)
        .set('Accept', 'application/json')
        .set('Authorization', token)
        .expect(200, done);
  });
});
