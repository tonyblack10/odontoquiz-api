const config = require('./env/environment')();
const express = require('express')
    , app = express()
    , shortcut = require('express-shortcut')(app)
    , bodyParser = require('body-parser')
    , consign = require('consign')
    , helmet = require('helmet')
    , compression = require('compression')
    , passport = require('passport')
    , cors = require('cors');

module.exports = () => {
  shortcut.use(
    cors(),
    express.static('./public'),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    helmet(),
    compression(),
    passport.initialize(),
    passport.session(),
    (req, res, next) => {
      delete req.body._id;
      next();
    }
  );

  consign({cwd: 'app', verbose: config.debug, locale: 'pt-br' })
    .include('models')
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
}