"use strict";
const faker = require("faker");

// Define an array called topics and populate it with fifteen objects.
// These plain JavaScript objects have keys for the attributes we want
// each Topic object to have except for id which will be assigned on topic creation.
let flairs = [];

for (let i = 1; i <= 5; i++) {
  flairs.push({
    name: faker.hacker.noun(),
    color: faker.commerce.color(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// Like migrations, the up method does something, and the down method reverts it.
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Flairs", flairs, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Flairs", null, {});
  }
};
