const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const config = require('./env/environment')();

module.exports = () => {
  const User = mongoose.model('User');
  const opts = {};
  opts.secretOrKey = config.jwtSecret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  
  passport.use(new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if(user)
        return done(null, {id: user._id, email: user.email, isAdmin: user.isAdmin});
    
      return done(null, false);
    } catch (err) {
      done(err, null);
    }
  }));

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', config.jwtSession),
    isAdmin: (req, res, next) => {
      if(!req.user.isAdmin)
        res.sendStatus(403);
      else
        return next();
    } 
  }
}