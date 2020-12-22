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
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    const ROUTE = this.BASE_ROUTE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/create`, this.create.bind(this));
    app.get(`${ROUTE}/view/:id`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('image'), this.save.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const cars = await this.carService.getAll();
    const { messages } = req.session;
    res.render('car/views/index.njk', { data: { cars }, messages });
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  create(req, res) {
    res.render('car/views/form.njk');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async view(req, res, next) {
    try {
      const { id } = req.params;
      const car = await this.carService.getById(id);
      res.render('car/views/view.njk', { car });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const car = await this.carService.getById(id);
      res.render('car/views/form.njk', { car });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async save(req, res, next) {
    try {
      const car = fromDataToEntity(req.body);

      if (req.file) {
        const { path } = req.file;
        car.image = path;
      }

      const savedCar = await this.carService.save(car);

      if (car.id) {
        req.session.messages = [`El auto con ID ${car.id} y marca ${car.brand} se actualizó`];
      } else {
        req.session.messages = [`Se creó un auto con ID ${savedCar.id} y marca ${savedCar.brand}`];
      }
      res.redirect('/cars');
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const car = await this.carService.getById(id);
      await this.carService.delete(car);
      req.session.messages = [`Se eliminó el auto con id ${car.id}, marca ${car.brand} y modelo ${car.model}`];
      res.redirect('/cars');
    } catch (e) {
      next(e);
    }
  }
};
