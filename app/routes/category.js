const auth = require('../../config/auth')();

module.exports = app => {
  const controller = app.controllers.category;

  app.route('/api/categories')
    .all(auth.authenticate())
    .get(controller.list)
    .post(controller.save);
  
  app.get('/api/categories/all', controller.getAll);

  app.route('/api/categories/:id')
    .all(auth.authenticate())
    .get(controller.getById)
    .put(controller.update)
    .delete(controller.remove);
}