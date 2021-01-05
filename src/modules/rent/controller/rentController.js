const AbstractController = require('../../abstractController');
const RentError = require('./error/rentError');
const { fromDataToEntity } = require('../mapper/rentMapper');

module.exports = class RentController extends AbstractController {
  /**
   * @param {import('../service/rentService')} RentService
   * @param {import('../../car/service/carService')} CarService
   * @param {import('../../user/service/userService')} UserService
   */
  constructor(RentService, CarService, UserService) {
    super();
    this.BASE_ROUTE = '/rents';
    this.RentService = RentService;
    this.CarService = CarService;
    this.UserService = UserService;
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
    app.post(`${ROUTE}/save`, this.save.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const rents = await this.RentService.getAll();
    const { messages } = req.session;
    res.render('rent/views/index.njk', { data: { rents }, messages });
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async create(req, res, next) {
    try {
      const users = await this.UserService.getAll();
      const cars = await this.CarService.getAll();

      if (users.length === 0) {
        throw new RentError('Se necesita por lo menos un usuario para hacer un alquiler');
      }

      if (cars.length === 0) {
        throw new RentError('Se necesita por lo menos un auto para hacer un alquiler');
      }

      res.render('rent/views/form.njk', { users, cars });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async view(req, res, next) {
    try {
      const { id } = req.params;
      const rent = await this.RentService.getById(id);
      res.render('rent/views/view.njk', { rent });
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
      const rent = await this.RentService.getById(id);
      const users = await this.UserService.getAll();
      const cars = await this.CarService.getAll();
      res.render('rent/views/form.njk', { rent, users, cars });
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
      const rent = fromDataToEntity(req.body);
      rent.Car = await this.CarService.getById(rent.Car.id);
      const savedRent = await this.RentService.save(rent);
      if (rent.id) {
        req.session.messages = [`Se actualizó el alquiler con id:${rent.id}`];
      } else {
        req.session.messages = [`Se creó un nuevo alquiler con id:${savedRent.id}`];
      }
      res.redirect('/rents');
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
      const rent = await this.RentService.getById(id);
      await this.RentService.delete(rent);
      req.session.messages = [`Se eliminó la renta con ID: ${rent.id}`];
      res.redirect('/rents');
    } catch (e) {
      next(e);
    }
  }
};
