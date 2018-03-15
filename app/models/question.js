const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

module.exports = () => {
  const optionSchema = new Schema({
    text: {
      type: String,
      required: true,
      maxlength: 250
    },
    isCorrect: {
      type: Boolean
    }
  });

  const questionSchema = new Schema({
    text: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200
    },
    options: {
      type: [optionSchema],
      validate: [
        { validator: val => val.length === 4, msg: '{PATH} must be size four' },
        { 
          validator: val => {
            let qtyCorrectOption = 0;
            val.forEach(option => {
              if(option.isCorrect) qtyCorrectOption++;
            });
            return qtyCorrectOption === 1;
          }, msg: '{PATH} there must be only one correct alternative'
        },
        {
          validator: val => {
            const optionsSet = new Set(val.map(option => option.text));
            return optionsSet.size === 4;
          }, msg: '{PATH} can not contain equal alternatives'
        }
      ]
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    explanation: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 600
    }
  });

  questionSchema.plugin(mongoosePaginate);
  questionSchema.plugin(mongooseDelete);

  return mongoose.model('Question', questionSchema, 'questions');
}