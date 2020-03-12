const userFixture = require('./userFixture');
const bookFixture = require('./bookFixture');
const loanFixture = require('./loanFixture');
const AbstractRepository = require('../database/repositories/abstractRepository');

module.exports = {
  user: userFixture,
  book: bookFixture,
  loan: loanFixture,

  async cleanDatabase() {
    await AbstractRepository.cleanDatabase();
  },
};
