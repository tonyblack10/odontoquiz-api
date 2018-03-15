describe('Route: questions', () => {
    const Category = app.models.category;
    const Question = app.models.question;
    let fakeCategory = undefined;
    let fakeQuestion = undefined;
    const fakeId = '56cb91bdc3464f14678934ca';

    const questions = [
      {
        text: "First Question",
        options: [
          {text : "Option One"},
          {text : "Option Two"},
          {text : "Option Three", isCorrect: true},
          {text : "Option Four"} 
        ]
      },
      {
        text: "Second Question",
        options: [
          {text : "Option One"},
          {text : "Option Two", isCorrect: true},
          {text : "Option Three"},
          {text : "Option Four"} 
        ]
      }
    ];

    beforeEach(done => {
      Category
        .remove({})
        .then(() => Question.remove({}))
        .then(() => Category.create({name: 'Category One'}))
        .then(category => {
          fakeCategory = category;
          questions[0].category = category._id;
          questions[1].category = category._id;
        })
        .then(() => Question.create(questions[0]))
        .then(question => {
          fakeQuestion = question;
          Question.create(questions[1])
        })
        .then(question => done());
    });

    describe('GET /api/questions', () => {
      describe('status 200', () => {
        it('returns a list of questions', done => {
          request.get('/api/questions')
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.have.length(2);
              expect(res.body[0].text).to.eql('First Question');
              expect(res.body[1].text).to.eql('Second Question');
              done(err);
            });
        });
      });
    });

    describe('POST /api/questions', () => {
      describe('status 201', () => {
        it('creates a new question', done => {
          request.post('/api/questions')
            .send({text: 'Question Test', options: questions[0].options})
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
            .expect(204)
            .end((err, res) => done(err));
        });
      });
    })
});