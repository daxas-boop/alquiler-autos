/* eslint-disable no-param-reassign */
const RentNotDefinedError = require('./error/rentNotDefinedError');
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError');
const Rent = require('../entity/rent');

module.exports = class RentService {
  /**
   * @param {import('../repository/sqlite/rentRepository')} RentRepository
   */
  constructor(RentRepository) {
    this.RentRepository = RentRepository;
  }

  getAll() {
    return this.RentRepository.getAll();
  }

  getById(id) {
    if (!id) {
      throw new RentIdNotDefinedError();
    }

    return this.RentRepository.getById(id);
  }

  delete(rent) {
    if (!(rent instanceof Rent)) {
      throw new RentNotDefinedError();
    }

    return this.RentRepository.delete(rent);
  }

  /**
   * @param {import('../entity/rent')} rent
   */
  async save(rent) {
    if (!(rent instanceof Rent)) {
      throw new RentNotDefinedError();
    }

    rent.pricePerDay = rent.Car.priceDay;
    rent.calculateTotalPrice(rent.Car.priceDay);

    return this.RentRepository.save(rent);
  }
};
