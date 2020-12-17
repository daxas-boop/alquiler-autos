const AbstractUserRepository = require('../abstractUserRepository');
const UserNotFoundError = require('../error/userNotFoundError');
const { fromModelToEntity } = require('../../mapper/userMapper');

module.exports = class UserRepository extends AbstractUserRepository {
  constructor(UserModel) {
    super();
    this.UserModel = UserModel;
  }

  async getAll() {
    const users = await this.UserModel.findAll();
    return users.map(fromModelToEntity);
  }

  async save(user) {
    let savedModel;
    if (user.id) {
      savedModel = await this.UserModel.build(user, { isNewRecord: false }).save();
    } else {
      savedModel = await this.UserModel.create(user);
    }
    return savedModel;
  }

  /**
   *
   * @param {String} id
   */
  async getById(id) {
    const userModel = await this.UserModel.findByPk(id);

    if (!userModel) {
      throw new UserNotFoundError(`El usuario con ID ${id} no se encontró (quizas haya sido eliminado).`);
    }

    return fromModelToEntity(userModel);
  }

  async delete(user) {
    if (!user || !user.id) {
      throw new UserNotFoundError();
    }
    return Boolean(this.UserModel.destroy({ where: { id: user.id } }));
  }
};
