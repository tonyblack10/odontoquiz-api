module.exports = app => {
  let controller = {};
  const Match = app.models.match;
  const Question = app.models.question;
  const Category = app.models.category;

  controller.getStatistics = async (req, res) => {
    try {
      const totalOfQuestions = await Question.count({
        $or: [{'deleted': {$exists: false}}, {'deleted': false}]
      });
      const totalOfMatches = await Match.count({
        $or: [{deleted: {$exists: false}}, {deleted: false}],
        finishedAt: {$ne: null}
      });
      const totalOfCategories = await Category.count({
        $or: [{'deleted': {$exists: false}}, {'deleted': false}]
      });
      res.json({totalOfQuestions, totalOfMatches, totalOfCategories});
    } catch (err) {
      res.status(500).json(err);
    }
  }

  return controller;
}
