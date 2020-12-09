const AbstractController = require('../../abstractController');

module.exports = class CarController extends AbstractController {
  constructor(carService, uploadManager) {
    super();
    this.BASE_ROUTE = '/car';
    this.carService = carService;
    this.uploadManager = uploadManager;
  }

  /**
   *
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.BASE_ROUTE;
    app.get(`${ROUTE}`, this.index.bind(this));
  }

  index(req, res) {
    res.render('car/views/index.html');
    this.carService.getAll();
  }
};
