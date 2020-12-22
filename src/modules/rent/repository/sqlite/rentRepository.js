const AbstractRentRepository = require('../abstractRentRepository');
const RentNotFoundError = require('../error/rentNotFoundError');
const { fromModelToEntity } = require('../../mapper/rentMapper');
const { fromModelToEntity: fromUserModelToEntity } = require('../../../user/mapper/userMapper');
const { fromModelToEntity: fromCarModelToEntity } = require('../../../car/mapper/carMapper');

module.exports = class RentRepository extends AbstractRentRepository {
  /**
   * @param {import('../../model/rentModel')} RentModel
   * @param {import('../../../car/model/carModel')} CarModel
   * @param {import('../../../user/model/userModel')} UserModel
   */
  constructor(RentModel, CarModel, UserModel) {
    super();
    this.RentModel = RentModel;
    this.CarModel = CarModel;
    this.UserModel = UserModel;
  }

  async getAll() {
    const rents = await this.RentModel.findAll({
      include: [
        { model: this.CarModel, paranoid: false },
        { model: this.UserModel, paranoid: false },
      ],
    });
    return rents.map((r) => fromModelToEntity(r, fromUserModelToEntity, fromCarModelToEntity));
  }

  /**
   * @param {import('../../entity/rent')} rent
   */
  async save(rent) {
    return this.RentModel.build(rent, { isNewRecord: !rent.id }).save();
  }

  /**
   * @param {String} id
   */
  async getById(id) {
    const rent = await this.RentModel.findByPk(id, {
      include: [
        { model: this.CarModel, paranoid: false },
        { model: this.UserModel, paranoid: false },
      ],
    });

    if (!rent) {
      throw new RentNotFoundError(`La renta con ID ${id} no se encontró (quizás haya sido borrada)`);
    }

    return fromModelToEntity(rent, fromUserModelToEntity, fromCarModelToEntity);
  }

  /**
   * @param {import('../../entity/rent')} rent
   * @returns {Boolean}
   */
  async delete(rent) {
    if (!rent || !rent.id) {
      throw new RentNotFoundError('El ID de la renta no está definido');
    }
    return Boolean(this.RentModel.destroy({ where: { id: rent.id } }));
  }
};
