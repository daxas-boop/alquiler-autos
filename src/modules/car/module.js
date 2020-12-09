const CarController = require('./controller/carController');
const CarService = require('./service/carService');
const CarRepository = require('./repository/sqlite/carRepository');

/**
 *
 * @param {import('rsdi').DIContainer} container
 * @param {import('express').Application} app
 */
function init(container, app) {
  const controller = container.get('CarController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  CarController,
  CarService,
  CarRepository,
};
