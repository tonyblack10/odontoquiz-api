const sanitize = require('mongo-sanitize');

module.exports = app => {
  let controller = {};
  const Question = app.models.question;

  controller.list = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const q = req.query.q || '';
      const questions = await Question
        .paginate({'text' : new RegExp(q, 'i'), 
          $or: [{'deleted': {$exists: false}}, {'deleted': false}]}, 
          { page, limit: 20, populate: 'category', sort: 'text' });
      res.json(questions);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  controller.getById = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const question = await Question.findById(_id);
      if(!question)
        res.status(404).json({error: 'QuestionNotFound'});
      else
        res.json(question);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  controller.save = async (req, res) => {
    try {
      const doc = await Question.create(_createQuestion(req.body));
      res.location(`/api/questions/${doc._id}`);
      res.status(201).json({message: 'Question created'});
    } catch (err) {
      if(err.name === 'ValidationError') 
        res.status(400).json(err);
      
      res.status(500).json(err);
    }
  };

  controller.update = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      await Question.findByIdAndUpdate({_id}, _createQuestion(req.body));
      res.sendStatus(204);
    } catch (err) {
      if(err.name === 'ValidationError') 
        res.status(400).json(err);
      
      res.status(500).json(err);
    }
  };

  controller.remove = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const question = await Question.findById(_id);
      await question.delete();
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  _createQuestion = body => {
    return {
      text: body.text,
      options: body.options,
      category: body.category,
      explanation: body.explanation
    };
  }

  return controller;
}