const faker = require('Faker');

let matchBuilder = {};

matchBuilder.getOne = questions => {
  return _createMatch(questions);
}

matchBuilder.answerMatch = match => {
  match.questionsAndAnswers.forEach(questionAndAnswer => {
    questionAndAnswer.chosenOption = questionAndAnswer.question.options[0];
  });

  return match;
}

_createMatch = questions => {
  let questionsAndAnswers = [];
  for(let i = 0; i < 10; i++) {
    questionsAndAnswers.push({
      question: questions[i]
    });
  }

  return { questionsAndAnswers };
}

module.exports = matchBuilder;
