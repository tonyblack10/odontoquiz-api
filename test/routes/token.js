const userBuilder = require('../builders/userBuilder');

describe('Route: token', () => {
  const User = app.models.user;
  let fakeUser;

  beforeEach(done => {
    User
      .remove({})
      .then(() => User.create(userBuilder.getOne()))
      .then(user => {
        fakeUser = user;
        done();
      }, err => done(err));
  });

  describe('POST /api/token', done => {
    describe('status 200', () => {
      it('get a valid token', done => {
        request.post('/api/token')
          .send({email: fakeUser.email, password: '123456'})
          .expect(200)
          .end((err, res) => {
            res.body.token.should.be.a('string');
            done(err);
          });
      });
    });

    describe('status 401', () => {
      it('throws error when user invalid', done => {
        request.post('/api/token')
          .send({email: 'invalid@email.com', password: 'invalid'})
          .expect(401)
          .end((err, res) => done(err));
      });
    });
  });

});