const auth = require('../../config/auth')();

module.exports = app => {
  const controller = app.controllers.match;

  app.route('/api/matches')
    .get(controller.list, auth.authenticate())
    .post(controller.save);

  app.route('/api/matches/:id')
    .get(controller.getById)
    .put(controller.update)
    .delete(controller.remove, auth.authenticate());
};