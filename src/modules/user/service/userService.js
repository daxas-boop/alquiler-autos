const UserNotDefinedError = require('./error/userNotDefinedError');
const IdNotDefinedError = require('./error/idNotDefinedError');
const User = require('../entity/user');

module.exports = class UserService {
  constructor(UserRepository) {
    this.UserRepository = UserRepository;
  }

  getAll() {
    return this.UserRepository.getAll();
  }

  /**
   * @param {import('../entity/user')} user
   */
  save(user) {
    if (!user) {
      throw new UserNotDefinedError();
    }

    return this.UserRepository.save(user);
  }

  getById(id) {
    if (!id) {
      throw new IdNotDefinedError();
    }

    return this.UserRepository.getById(id);
  }

  delete(user) {
    if (!(user instanceof User)) {
      throw new UserNotDefinedError();
    }
    return this.UserRepository.delete(user);
  }
};
