const AbstractCarRepository = require('../abstractCarRepository');
const CarNotFoundError = require('../error/carNotFoundError');
const { fromModelToEntity } = require('../../mapper/carMapper');

module.exports = class CarRepository extends AbstractCarRepository {
  constructor(CarModel) {
    super();
    this.CarModel = CarModel;
  }

  async getAll() {
    const cars = await this.CarModel.findAll();
    return cars.map(fromModelToEntity);
  }

  /**
   *
   * @param {Number} id
   */
  async getById(id) {
    const car = await this.CarModel.findByPk(id);

    if (car === null) {
      throw new CarNotFoundError(`El auto con ID ${id} no se encontró`);
    }

    return fromModelToEntity(car);
  }

  async save(car) {
    let modelCar;
    if (car.id) {
      modelCar = await this.CarModel.build(car, { isNewRecord: false }).save();
    } else {
      modelCar = await this.CarModel.create(car);
    }

    return fromModelToEntity(modelCar);
  }

  /**
   *
   * @param {import('../../entity/car')} car
   */
  async delete(car) {
    if (!car || !car.id) {
      throw new CarNotFoundError('El ID del club no está definido');
    }

    return Boolean(await this.CarModel.destroy({ where: { id: car.id } }));
  }
};
