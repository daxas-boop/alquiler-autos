const CarController = require('./carController/carController');
const CarService = require('./carService/carService');
const CarRepository = require('./carRepository/sqlite/carRepository');

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
