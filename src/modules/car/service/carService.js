const CarIdNotDefinedError = require('./error/carIdNotDefinedError');
const CarNotDefinedError = require('./error/carNotDefinedError');
const Car = require('../entity/car');

module.exports = class CarService {
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  async getAll() {
    return this.carRepository.getAll();
  }

  /**
   * @param {Number} id
   */
  async getById(id) {
    if (!id) {
      throw new CarIdNotDefinedError();
    }

    return this.carRepository.getById(id);
  }

  /**
   * @param {Car} car
   */
  async save(car) {
    if (car === undefined) {
      throw new CarNotDefinedError();
    }

    return this.carRepository.save(car);
  }

  async delete(car) {
    if (!(car instanceof Car)) {
      throw new CarNotDefinedError();
    }

    return this.carRepository.delete(car);
  }
};
