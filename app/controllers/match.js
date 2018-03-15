const sanitize = require('mongo-sanitize');
const shuffle = require('shuffle-array');

module.exports = app => {
  let controller = {};
  const NUMBER_OF_QUESTIONS_PER_MATCH = 10;
  const Match = app.models.match;
  const Question = app.models.question;

  controller.list = async (req, res) => {}

  controller.save = async (req, res) => {
    try {
      const questions = await Question
        .find({$or: [{'deleted': {$exists: false}}, {'deleted': false}], 
        'category': {$in: req.body.categories} });
      const doc = await Match.create({ questionsAndAnswers: _createQuestionsAndAnswers(questions)});
      res.location(`/api/matches/${doc._id}`);
      res.status(201).json(doc);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
  
  controller.getById = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const match = await Match.findById(_id)
        .populate('questionsAndAnswers.question');
      if(!match)
        res.status(404).json({error: 'MatchNotFound'});
      else
        res.json(match);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  
  controller.update = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const match = await Match.findById(_id);
      delete match.startedAt;
      if(match.finishedAt) {
        res.status(400).json({message: 'After finished the match can not be changed'});
      } else {
        match.questionsAndAnswers = req.body.questionsAndAnswers;
        match.finishedAt = Date.now();
        await match.save();
        res.json({message: 'Match finished'});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
  
  controller.remove = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const match = await Match.findById(_id);
      await match.delete();
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  _createQuestionsAndAnswers = questions => {
    return shuffle
      .pick(questions, {'picks': NUMBER_OF_QUESTIONS_PER_MATCH})
      .map(question => {
        return {question: question._id};
      });
  }

  return controller;
};