const auth = require('../../config/auth')();

module.exports = app => {
  const controller = app.controllers.question;

  app.route('/api/questions')
    .all(auth.authenticate())
    .get(controller.list)
    .post(controller.save);

  app.route('/api/questions/:id')
    .all(auth.authenticate())
    .get(controller.getById)
    .put(controller.update)
    .delete(controller.remove);
}