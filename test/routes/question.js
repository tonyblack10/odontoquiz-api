const jwt = require('jwt-simple');
const questionBuilder = require('../builders/questionBuilder');
const categoryBuilder = require('../builders/categoryBuilder');
const userBuilder = require('../builders/userBuilder');
const config = require('../../config/env/environment')();

describe('Route: questions', () => {
  const Question = app.models.question;
  const Category = app.models.category;
  const User = app.models.user;
  const jwtSecret = app.config
  let fakeQuestion;
  let fakeCategory;
  const fakeId = '56cb91bdc3464f14678934ca';
  let token;

    beforeEach(done => {
      User
        .remove({})
        .then(() => User.create(userBuilder.getOne()))
        .then(user => {
          token = jwt.encode({id: user._id}, config.jwtSecret);
          return Category.remove({});
        })
        .then(() => Category.create(categoryBuilder.getOne()))
        .then(category => {
          fakeCategory = category;
          return Question.remove({});
        })
        .then(() => Question.insertMany(questionBuilder.getMany(fakeCategory)))
        .then(docs => {
          fakeQuestion = docs[0];
          done();
        }, err => done(err));
    });

    describe('GET /api/questions', () => {
      describe('status 200', () => {
        it('returns a list of questions', done => {
          request.get('/api/questions')
            .set('Authorization', `JWT ${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.docs).to.have.length(5);
              done(err);
            });
        });
      });
    });

    describe('POST /api/questions', () => {
      describe('status 201', () => {
        it('creates a new question', done => {
          request.post('/api/questions')
            .set('Authorization', `JWT ${token}`)
            .send(questionBuilder.getOne(fakeCategory))
            .expect(201)
            .end((err, res) => {
              const isHeaderPresent = res.header['location'] !== undefined;
              expect(isHeaderPresent).to.be.true;
              done(err);
            });
        });
      });
    });

    describe('GET /api/questions/:id', () => {
      describe('status 200', () => {
        it('returns a question', done => {
          request.get(`/api/questions/${fakeQuestion._id}`)
            .set('Authorization', `JWT ${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.text).to.eql(fakeQuestion.text);
              done(err);
            });
        });
      });

      describe('status 404', () => {
        it('throws error when question not exist', done => {
          request.get(`/api/questions/${fakeId}`)
            .set('Authorization', `JWT ${token}`)
            .expect(404)
            .end((err, res) => done(err));
        });
      });
    });

    describe('PUT /api/questions/:id', () => {
      describe('status 204', () => {
        it('updates a question', done => {
          fakeQuestion.text = 'Question Updated';
          request.put(`/api/questions/${fakeQuestion._id}`)
            .set('Authorization', `JWT ${token}`)
            .send(fakeQuestion)
            .expect(204)
            .end((err, res) => done(err));
        });
      });
    });

    describe('DELETE /api/questions/:id', () => {
      describe('status 204', () => {
        it('removes a question', done => {
          request.delete(`/api/questions/${fakeQuestion._id}`)
            .set('Authorization', `JWT ${token}`)
            .expect(204)
            .end((err, res) => done(err));
        });
      });
    })
});