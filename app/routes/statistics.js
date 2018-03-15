const auth = require('../../config/auth')();

module.exports = app => {
  const controller = app.controllers.statistics;

  app.get('/api/statistics', auth.authenticate(), controller.getStatistics);
}