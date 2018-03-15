module.exports = app => {
  let controller = {};
  const Category = app.models.category;
  const Question = app.models.question;

  controller.getStatistics = async (req, res) => {
    try {
      const totalOfQuestions = await Question.count({'deleted': {$exists: false}});
      res.json({totalOfQuestions});
    } catch (err) {
      res.status(500).json(err);
    }
  }

  return controller;
}
