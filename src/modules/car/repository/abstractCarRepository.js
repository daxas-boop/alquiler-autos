const AbstractCarRepositoryError = require('./error/abstractCarRepositoryError');

module.exports = class AbstractCarRepository {
  constructor() {
    if (new.target === AbstractCarRepository) {
      throw new AbstractCarRepositoryError();
    }
  }
};
