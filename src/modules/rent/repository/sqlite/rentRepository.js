const AbstractRentRepository = require('../abstractRentRepository');
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

  async save(rent) {
    return this.RentModel.build(rent, { isNewRecord: !rent.id }).save();
  }
};
