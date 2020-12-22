const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/userMapper');

module.exports = class UserController extends AbstractController {
  constructor(UserService) {
    super();
    this.BASE_ROUTE = '/users';
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
    const users = await this.UserService.getAll();
    const { messages } = req.session;
    res.render('user/views/index.njk', { data: { users }, messages });
    req.session.messages = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  // eslint-disable-next-line class-methods-use-this
  create(req, res) {
    res.render('user/views/form.njk');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async view(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.UserService.getById(id);
      res.render('user/views/view.njk', { user });
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
      const user = await this.UserService.getById(id);
      res.render('user/views/form.njk', { user });
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
      const user = fromDataToEntity(req.body);
      const savedUser = await this.UserService.save(user);
      if (user.id) {
        req.session.messages = [`El usuario con ID ${user.id} y nombre ${user.name} se actualizó`];
      } else {
        req.session.messages = [`Se creó un usuario con ID ${savedUser.id} y nombre ${savedUser.name}`];
      }
      res.redirect('/users');
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
      const user = await this.UserService.getById(id);
      await this.UserService.delete(user);
      req.session.messages = [`Se eliminó el usuario con id ${user.id} y nombre ${user.name}`];
      res.redirect('/users');
    } catch (e) {
      next(e);
    }
  }
};
