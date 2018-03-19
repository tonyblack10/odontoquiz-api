const faker = require('Faker');

let userBuilder = {};

userBuilder.getOne = () => {
  return _createUser();
}

userBuilder.getMany = (number=5) => {
  let list = [];
  for(let i = 0; i < number; i++) {
    list.push(_createUser());
  }

  return list;
}

_createUser = () => {
  const name = `${faker.Name.firstNameMale()} ${faker.Name.lastName()}`;
  return {
    name,
    email: faker.Internet.email(),
    password: '123456',
    isAdmin: true
  };
}

module.exports = userBuilder;