const auth = require('../../config/auth')();

module.exports = app => {
  const controller = app.controllers.user;

  app.route('/api/users')
    .all(auth.authenticate())
    .get(auth.isAdmin, controller.list)
    .post(auth.isAdmin, controller.save);

  app.route('/api/users/:id')
    .all(auth.authenticate())
    .delete(auth.isAdmin, controller.remove);

  app.post('/api/users/change-password', auth.authenticate(), controller.changePassword);

  app.get('/api/users/email/:email', auth.authenticate(), auth.isAdmin, controller.getByEmail);
};