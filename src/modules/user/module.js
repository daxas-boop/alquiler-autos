const UserController = require('./controller/userController');
const UserService = require('./service/userService');
const UserRepository = require('./repository/sqlite/userRepository');
const UserModel = require('./model/userModel');

/**
 * @param {import('rsdi')DIContainer} container
 * @param {import('express').Application} app
 */
function init(container, app) {
  const controller = container.get('UserController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  UserController,
  UserService,
  UserRepository,
  UserModel,
};
