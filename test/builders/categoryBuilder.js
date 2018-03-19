const faker = require('Faker');

let categoryBuilder = {};

categoryBuilder.getOne = () => {
  const name = `${faker.Lorem.words(1)[0]} ${faker.Lorem.words(1)[0]}`;
  return {
    name
  };
}

categoryBuilder.getMany = (number=5) => {
  let list = [];
  for(let i = 0; i < number; i++) {
    const name = `${faker.Lorem.words(1)[0]} ${faker.Lorem.words(1)[0]}`;
    list.push({name});
  }

  return list;
}

module.exports = categoryBuilder;
