const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

module.exports = () => {
  const categorySchema = new Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
      index: {
        unique: true
      }
    }
  });

  categorySchema.plugin(mongoosePaginate);
  categorySchema.plugin(mongooseDelete);

  return mongoose.model('Category', categorySchema, 'categories');
};