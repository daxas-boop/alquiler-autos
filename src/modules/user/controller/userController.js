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
    const { messages, errors } = req.session;
    res.render('user/views/index.html', { data: { users }, messages, errors });
    req.session.messages = [];
    req.session.errors = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  // eslint-disable-next-line class-methods-use-this
  create(req, res) {
    res.render('user/views/form.html');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    try {
      const { id } = req.params;
      const user = await this.UserService.getById(id);
      res.render('user/views/form.html', { data: { user } });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
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
      req.session.errors = [e.message, e.stack];
      res.redirect('/users');
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await this.UserService.getById(id);
      await this.UserService.delete(user);
      req.session.messages = [`Se eliminó el usuario con id ${user.id} y nombre ${user.name}`];
      res.redirect('/users');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/users');
    }
  }
};
