const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

module.exports = () => {
  const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 200
    },
    email: {
      type: String,
      required: true,
      maxlength: 200,
      index: {
        unique: true
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 10
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  });

  userSchema.post('validate', doc => {
    const salt = bcrypt.genSaltSync();
    doc.password = bcrypt.hashSync(doc.password, salt);
  });

  userSchema.statics.comparePassword = function(candidatePassword, targetUser) {
    return bcrypt.compareSync(candidatePassword, targetUser.password);
  };

  userSchema.plugin(mongoosePaginate);
  userSchema.plugin(mongooseDelete);

  return mongoose.model('User', userSchema, 'users');
}