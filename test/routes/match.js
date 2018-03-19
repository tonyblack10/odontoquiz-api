const jwt = require('jwt-simple');
const config = require('../../config/env/environment')();
const categoryBuilder = require('../builders/categoryBuilder');
const questionBuilder = require('../builders/questionBuilder');
const matchBuilder = require('../builders/matchBuilder');
const userBuilder = require('../builders/userBuilder');

describe('Route: matches', () => {
  const Category = app.models.category;
  const Match = app.models.match;
  const User = app.models.user;
  const Question = app.models.question;
  let fakeCategory = undefined;
  let fakeMatch;
  let fakeFinishedMatch;
  const fakeId = '56cb91bdc3464f14678934ca';
  let token;
  
  beforeEach(done => {
    Match
      .remove({})
      .then(() => Category.remove({}))
      .then(() => Category.create(categoryBuilder.getOne()))
      .then(category => {
        fakeCategory = category;
        return Question.remove({});
      })
      .then(() => Question.insertMany(questionBuilder.getMany(fakeCategory, 15)))
      .then(docs =>
        Match.create(matchBuilder.getOne(docs)))
      .then(match => {
        fakeMatch = match;
        fakeFinishedMatch = match;
        return User.remove({});
      })
      .then(() => User.create(userBuilder.getOne()))
      .then(user => {
        token = jwt.encode({id: user._id}, config.jwtSecret);
        done();
      }, err => done(err));
  });

  describe('GET /api/matches/:id', () => {
    describe('status 200', () => {
      it('returns a match', done => {
        request.get(`/api/matches/${fakeMatch._id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            done(err);
          });
      });
    });

    describe('status 404', () => {
      it('throws error when match not exist', done => {
        request.get(`/api/matches/${fakeId}`)
          .set('Authorization', `JWT ${token}`)
          .expect(404)
          .end((err, res) => done(err));
      });
    });

  });

  describe('PUT /api/matches/:id', () => {
    describe('status 204', () => {
      it('updates a match', done => {
        request.put(`/api/matches/${fakeMatch._id}`)
          .send(matchBuilder.answerMatch(fakeMatch))
          .expect(204)
          .end((err, res) => done(err));
      });
    });

    describe('status 400', () => {
      it('updates a match', done => {
        Match.findById(fakeMatch._id)
          .then(match => {
            match.finishedAt = Date.now();
            return match.save();
          })
          .then(() => {
            request.put(`/api/matches/${fakeMatch._id}`)
              .send(matchBuilder.answerMatch(fakeMatch))
              .expect(400)
              .end((err, res) => {
                expect(res.body.message).to.eql('After finished the match can not be changed');
                done(err)
              });
          }, err => done(err));
      });
    });

  });

  describe('DELETE /api/matches/:id', () => {
    describe('status 204', () => {
      it('removes a match', done => {
        request.delete(`/api/matches/${fakeMatch._id}`)
        .set('Authorization', `JWT ${token}`)
        .expect(204)
        .end((err, res) => done(err));
      });
    });
  });

});
