const AbstractClientRepositoryError = require('./error/abstractClientRepositoryError');

module.exports = class AbstractClientRepository {
  constructor() {
    if (new.target === AbstractClientRepository) {
      throw new AbstractClientRepositoryError();
    }
  }
};
