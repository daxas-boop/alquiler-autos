const AbstractCarRepository = require('../abstractCarRepository');

module.exports = class CarRepository extends AbstractCarRepository {
  constructor(databaseAdapter) {
    super();
    this.databaseAdapter = databaseAdapter;
  }
};
