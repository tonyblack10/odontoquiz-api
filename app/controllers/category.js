const sanitize = require('mongo-sanitize');

module.exports = app => {
  let controller = {};
  const Category = app.models.category;
  const Question = app.models.question;

  controller.list = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const q = req.query.q || '';
      const categories = await Category
        .paginate({'name' : new RegExp(q, 'i'), 
          $or: [{'deleted': {$exists: false}}, {'deleted': false}]}, 
          { page, limit: 20, sort: 'name' });
      res.json(categories);
    }catch(err) {
      res.status(500).json(err);
    }
  }

  controller.getById = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const category = await Category.findById(_id);
      if(!category)
        res.status(404).json({error: "CategoryNotFound"});
      else
        res.json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  controller.save = async (req, res) => {
    const category = { name: req.body.name };
    try {
      const doc = await Category.create(category);
      res.location(`/api/categories/${doc._id}`);
      res.status(201).json({message: 'Category created'});
    } catch (err) {
      if(err.name === 'ValidationError') 
        res.status(400).json(err);
      
      res.status(500).json(err);
    }
  }

  controller.update = async (req, res) => {
    const _id = sanitize(req.params.id);
    const category = { name: req.body.name };
    try {
      await Category.findByIdAndUpdate({_id}, category);
      res.sendStatus(204);
    } catch (err) {
      if(err.name === 'ValidationError') 
        res.status(400).json(err);
      
      res.status(500).json(err);
    }
  }

  controller.remove = async (req, res) => {
    const _id = sanitize(req.params.id);
    try {
      const category = await Category.findById(_id);
      const questions = await Question.find({'category': category._id});
      await questions.forEach(question => question.delete());
      await category.delete();
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  controller.getAll = async (req, res) => {
    try {
      const categories = await Category
        .find({$or: [{'deleted': {$exists: false}}, {'deleted': false}]})
        .select('name _id');
      res.json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  return controller;
}