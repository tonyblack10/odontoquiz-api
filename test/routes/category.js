const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const categoryBuilder = require('../builders/categoryBuilder');
const userBuilder = require('../builders/userBuilder');
const config = require('../../config/env/environment')();

describe('Route: categories', () => {
  const Category = app.models.category;
  const User = app.models.user;
  const jwtSecret = app.config
  let fakeCategory = undefined;
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
      .then(() => Category.insertMany(categoryBuilder.getMany()))
      .then(docs => {
        fakeCategory = docs[0];
        done();
      }, err => done(err));
  });

  describe('GET /api/categories', () => {
    describe('status 200', () => {
      it('returns a list of categories', done => {
        request.get('/api/categories')
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.docs).to.have.length(5);
            res.body.total.should.equal(5);
            done(err);
          });
      })
    });
  });

  describe('POST /api/categories', () => {
    describe('status 201', () => {
      it('creates a new category', done => {
        request.post('/api/categories')
          .set('Authorization', `JWT ${token}`)
          .send({name: 'Category Test'})
          .expect(201)
          .end((err, res) => {
            const isHeaderPresent = res.header['location'] !== undefined;
            expect(isHeaderPresent).to.be.true;
            done(err);
          });
      });
    });
  });

  describe('GET /api/categories/:id', () => {
    describe('status 200', () => {
      it('returns a category', done => {
        request.get(`/api/categories/${fakeCategory._id}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.name).to.eql(fakeCategory.name);
            done(err);
          });
      });
    });

    describe('status 404', () => {
      it('throws error when category not exist', done => {
        request.get(`/api/categories/${fakeId}`)
          .set('Authorization', `JWT ${token}`)
          .expect(404)
          .end((err, res) => done(err));
      });
    });
  });

  describe('PUT /api/categories/:id', () => {
    describe('status 204', () => {
      it('updates a category', done => {
        request.put(`/api/categories/${fakeCategory._id}`)
          .set('Authorization', `JWT ${token}`)
          .send({name: 'Category Modified'})
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });

  describe('DELETE /api/categories/:id', () => {
    describe('status 204', () => {
      it('removes a category', done => {
        request.delete(`/api/categories/${fakeCategory._id}`)
        .set('Authorization', `JWT ${token}`)
        .expect(204)
        .end((err, res) => done(err));
      });
    });
  });

});