const CarIdNotDefinedError = require('./error/carIdNotDefinedError');
const CarNotFoundError = require('./error/carNorDefinedError');
const Car = require('../entity/car');

module.exports = class CarService {
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  getAll() {
    return this.carRepository.getAll();
  }

  /**
   *
   * @param {Number} id
   */
  getById(id) {
    if (!id) {
      throw new CarIdNotDefinedError();
    }
    return this.carRepository.getById(id);
  }

  /**
   *
   * @param {Car} car
   */
  save(car) {
    if (car === undefined) {
      throw CarNotFoundError();
    }

    return this.carRepository.save(car);
  }
};
