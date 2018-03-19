const faker = require('Faker');

let questionBuilder = {};

questionBuilder.getOne = category => {
  return _createQuestion(category);
}

questionBuilder.getMany = (category, number=5) => {
  let list = [];
  for(let i = 0; i < number; i++) {
    list.push(_createQuestion(category));
  }

  return list;
}

_createOptions = () => {
  let options = [];
  for(let i = 0; i < 4; i++) {
    const option = {
      text: faker.Lorem.words(1)[0]+i
    }
    options.push(option);
  }
  options[0].isCorrect = true;

  return options;
}

_createQuestion = category => {
  return {
    text: `${faker.Lorem.sentence(10, 5)}?`,
    options: _createOptions(),
    category: category._id,
    explanation: faker.Lorem.sentence(20, 5)
  };
}

module.exports = questionBuilder;