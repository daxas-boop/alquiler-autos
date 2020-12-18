const RentController = require('./controller/rentController');
const RentService = require('./service/rentService');
const RentRepository = require('./repository/sqlite/rentRepository');
const RentModel = require('./model/rentModel');

/**
 * @param {import('rsdi').IDIContainer} container
 * @param {import('express').Application} app
 */
function init(container, app) {
  const controller = container.get('RentController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  RentController,
  RentService,
  RentRepository,
  RentModel,
};
