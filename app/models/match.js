const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

module.exports = () => {
  const questionAndAnswerSchema = new Schema({
    question: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Question'
    },
    chosenOption: {
      type: Schema.Types.ObjectId
    }
  });

  const matchSchema = new mongoose.Schema({
    questionsAndAnswers: {
      type: [questionAndAnswerSchema],
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    finishedAt: {
      type: Date
    }
  });

  matchSchema.plugin(mongoosePaginate);
  matchSchema.plugin(mongooseDelete);

  return mongoose.model('Match', matchSchema, 'matches');
};