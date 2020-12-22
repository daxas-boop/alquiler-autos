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
  save(rent) {
    if (!(rent instanceof Rent)) {
      throw new RentNotDefinedError();
    }

    rent.pricePerDay = rent.Car.priceDay;
    const milisecondDiff = new Date(rent.finishDate).getTime() - new Date(rent.startDate).getTime();
    const dayDiff = Math.round(milisecondDiff / (1000 * 3600 * 24));
    rent.totalPrice = dayDiff * rent.Car.priceDay;

    return this.RentRepository.save(rent);
  }
};
