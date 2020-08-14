const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const server = require('../dist/index');
const config = require('../dist/config/test');

chai.use(chaiHttp);

describe('Should initialise the APP', () => {
  const { SETTINGS } = config;
  server.start(SETTINGS);
  it('/ping should return pong', (done) => {
    chai.request(server.app)
      .get('/ping')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('text').eql('pong');
        done();
      });
  });
});
