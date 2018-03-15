module.exports = app => {
  const controller = app.controllers.token;

  app.post('/api/token', controller.authenticate);
};