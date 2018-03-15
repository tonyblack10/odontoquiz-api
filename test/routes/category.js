describe('Route: categories', () => {
  const Category = app.models.category;
  let fakeCategory = undefined;
  const fakeId = '56cb91bdc3464f14678934ca';

  beforeEach(done => {
    Category
      .remove({})
      .then(() => Category.create({name: 'Category One'}))
      .then(category => Category.create({name: "Category Two"}))
      .then(category => {
        fakeCategory = category;
        done();
      });
  });

  describe('GET /api/categories', () => {
    describe('status 200', () => {
      it('returns a list of categories', done => {
        request.get('/api/categories')
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.length(2);
            expect(res.body[0].name).to.eql('Category One');
            expect(res.body[1].name).to.eql('Category Two');
            done(err);
          });
      })
    });
  });

  describe('POST /api/categories', () => {
    describe('status 201', () => {
      it('creates a new category', done => {
        request.post('/api/categories')
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
          .expect(200)
          .end((err, res) => {
            expect(res.body.name).to.eql('Category Two');
            done(err);
          });
      });
    });

    describe('status 404', () => {
      it('throws error when category not exist', done => {
        request.get(`/api/categories/${fakeId}`)
          .expect(404)
          .end((err, res) => done(err));
      });
    });
  });

  describe('PUT /api/categories/:id', () => {
    describe('status 204', () => {
      it('updates a category', done => {
        request.put(`/api/categories/${fakeCategory._id}`)
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
        .expect(204)
        .end((err, res) => done(err));
      });
    });
  });

});