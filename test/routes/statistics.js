const jwt = require('jwt-simple');
const config = require('../../config/env/environment')();
const userBuilder = require('../builders/userBuilder');

describe('Route: statistics', () => {
  const jwtSecret = app.config;
  const User = app.models.user;
  let token;

  beforeEach(done => {
    User
      .remove({})
      .then(() => User.create(userBuilder.getOne()))
      .then(user => {
        token = jwt.encode({id: user._id}, config.jwtSecret);
        done();
      }, err => done(err));
  });
  
  describe('GET /api/statistics', () => {
    describe('status 200', () => {
      it('returns the statistics do app', done => {
        request.get('/api/statistics')
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.totalOfQuestions).to.be.a('number');
            expect(res.body.totalOfMatches).to.be.a('number');
            expect(res.body.totalOfCategories).to.be.a('number');
            done(err);
          });
      });
    });
  });
});
