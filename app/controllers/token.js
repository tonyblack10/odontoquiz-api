const jwt = require('jwt-simple');
const config = require('../../config/env/environment')();

module.exports = app => {
  const User = app.models.user;
  let controller = {};

  controller.authenticate = async (req, res) => {
    if(req.body.email && req.body.password) {
      try {
        const user = await User.findOne({email: req.body.email});
        if(User.comparePassword(req.body.password, user)) {
          const payload = {id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin};
          res.json({token: jwt.encode(payload, config.jwtSecret)});
        } else {
          res.sendStatus(401);
        }
      } catch (err) {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  };

  return controller;
};