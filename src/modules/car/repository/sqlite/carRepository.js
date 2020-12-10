const AbstractCarRepository = require('../abstractCarRepository');
const CarNotFoundError = require('../error/carNotFoundError');
const { fromDbToEntity } = require('../../mapper/carMapper');

module.exports = class CarRepository extends AbstractCarRepository {
  constructor(databaseAdapter) {
    super();
    this.databaseAdapter = databaseAdapter;
  }

  async getAll() {
    const cars = this.databaseAdapter.prepare(`
      SELECT
        id,
        marca,
        modelo,
        año,
        kilometros,
        color,
        aire,
        pasajeros,
        transmision,
        imagen
      FROM cars
    `).all();
    return cars.map((carData) => fromDbToEntity(carData));
  }

  /**
   *
   * @param {Number} id
   */
  async getById(id) {
    const car = this.databaseAdapter.prepare(`
      SELECT
        id,
        marca,
        modelo,
        año,
        kilometros,
        color,
        aire,
        pasajeros,
        transmision
      FROM cars WHERE id = ?
    `).get(id);

    if (car === undefined) {
      throw new CarNotFoundError(`El auto con ID ${id} no se encontró`);
    }

    return fromDbToEntity(car);
  }

  async save(car) {
    let id;
    if (car.id) {
      id = car.id;
      const statement = this.databaseAdapter.prepare(`
        UPDATE cars SET
          ${car.imagen ? 'imagen = ?,' : ''}
          marca = ?,
          modelo = ?,
          año = ?,
          kilometros = ?,
          color = ?,
          aire = ?,
          pasajeros = ?,
          transmision = ?
          WHERE id = ?
      `);

      const params = [
        car.marca,
        car.modelo,
        car.año,
        car.kilometros,
        car.color,
        car.aire,
        car.pasajeros,
        car.transmision,
        car.id,
      ];

      if (car.imagen) {
        params.unshift(car.imagen);
      }

      statement.run(params);
    } else {
      const statement = this.databaseAdapter.prepare(`
        INSERT INTO cars(
          marca,
          modelo,
          año,
          kilometros,
          color,
          aire,
          pasajeros,
          transmision,
          imagen
        ) VALUES (?, ?, ? ,? ,? ,? ,? ,? ,?)
      `);

      const result = statement.run(
        car.marca,
        car.modelo,
        car.año,
        car.kilometros,
        car.color,
        car.aire,
        car.pasajeros,
        car.transmision,
        car.imagen,
      );

      id = result.lastInsertRowid;
    }

    return this.getById(id);
  }
};
