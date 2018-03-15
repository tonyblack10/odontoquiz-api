const sanitize = require('mongo-sanitize');

module.exports = app => {
  let controller = {};
  const User = app.models.user;

  controller.list = async (req, res) => {
    const page = req.query.page || 1;
    const q = req.query.q || '';
    try {
      const users = await User
        .paginate({'name' : new RegExp(q, 'i'), '_id': {$ne: req.user.id},
        $or: [{'deleted': {$exists: false}}, {'deleted': false}]}, 
        { page, limit: 20, sort: 'name', select: '_id name email isAdmin' });

      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  controller.save = async (req, res) => {
    try {
      const doc = await User.create(_createUser(req.body));
      res.location(`/api/users/${doc._id}`);
      res.status(201).json({message: 'User created'});
    } catch (err) {
      res.status(500).json(err);
    }
  };

  controller.getByEmail = async (req, res) => {
    const email = req.params.email;
    try {
      const result = await User.findOne({email}, 'email');
      res.json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  controller.remove = async (req, res) => {
    try {
      const _id = sanitize(req.params.id);
      if(_id === req.user.id) {
        res.sendStatus(400);
      } else {
        const user = await User.findById(_id);
        if(user.isAdmin) {
          res.sendStatus(400);
        } else {
          await user.remove();
          res.sendStatus(204);
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  controller.update = async (req, res) => {
    try {
      const _id = sanitize(req.params.id);
      if(_id !== req.user._id) {
        res.sendStatus(400);
      } else {
        await User.findByIdAndUpdate({_id}, {name: req.body.name, email: req.body.email});
        res.sendStatus(204);          
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  controller.changePassword = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if(!User.comparePassword(req.body.currentPassword, user) ||
        User.comparePassword(req.body.newPassword, user)) {
        res.sendStatus(400); 
      } else {
        user.password = req.body.newPassword;
        user.save();
        res.sendStatus(204);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  _createUser = body => {
    return {
      name: body.name,
      email: body.email,
      password: body.password,
      isAdmin: body.isAdmin || false
    };
  };

  return controller;
};