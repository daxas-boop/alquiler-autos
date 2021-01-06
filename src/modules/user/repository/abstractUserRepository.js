const AbstractUserRepositoryError = require('./error/abstractUserRepositoryError');

module.exports = class AbstractUserRepository {
  constructor() {
    if (new.target === AbstractUserRepository) {
      throw new AbstractUserRepositoryError();
    }
  }
};
