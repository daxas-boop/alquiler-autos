/* eslint-disable class-methods-use-this */
const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/carMapper');

module.exports = class CarController extends AbstractController {
  constructor(carService, uploadMiddleware) {
    super();
    this.BASE_ROUTE = '/cars';
    this.carService = carService;
    this.uploadMiddleware = uploadMiddleware;
  }

  /**
   *
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.BASE_ROUTE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/create`, this.create.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('imagen'), this.save.bind(this));
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const cars = await this.carService.getAll();
    const { messages, errors } = req.session;
    res.render('car/views/index.html', { data: { cars }, messages, errors });
    req.session.messages = [];
    req.session.errors = [];
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  create(req, res) {
    res.render('car/views/form.html');
  }

  async edit(req, res) {
    try {
      const { id } = req.params;
      const car = await this.carService.getById(id);
      res.render('car/views/form.html', { data: { car } });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const car = fromDataToEntity(req.body);

      if (req.file) {
        const { path } = req.file;
        car.imagen = path;
      }

      const savedCar = await this.carService.save(car);

      if (car.id) {
        req.session.messages = [`El auto con ID ${car.id} y modelo ${car.modelo} se actualizó`];
      } else {
        req.session.messages = [`Se creó un auto con ID ${savedCar.id} y modelo ${savedCar.id}`];
      }
      res.redirect('/cars');
    } catch (e) {
      req.errors = [e.message, e.stack];
      res.redirect('/cars');
    }
  }

  delete(req, res) {

  }
};
