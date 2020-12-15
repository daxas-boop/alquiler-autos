const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/clientMapper');

module.exports = class ClientController extends AbstractController {
  constructor(ClientService) {
    super();
    this.BASE_ROUTE = '/clients';
    this.ClientService = ClientService;
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
    const clients = await this.ClientService.getAll();
    const { messages, errors } = req.session;
    res.render('client/views/index.html', { data: { clients }, messages, errors });
    req.session.messages = [];
    req.session.errors = [];
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  // eslint-disable-next-line class-methods-use-this
  create(req, res) {
    res.render('client/views/form.html');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async edit(req, res) {
    try {
      const { id } = req.params;
      const client = await this.ClientService.getById(id);
      res.render('client/views/form.html', { data: { client } });
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
      const client = fromDataToEntity(req.body);
      const savedClient = await this.ClientService.save(client);
      if (client.id) {
        req.session.messages = [`El cliente con ID ${client.id} y nombre ${client.name} se actualizó`];
      } else {
        req.session.messages = [`Se creó un cliente con ID ${savedClient.id} y nombre ${savedClient.name}`];
      }
      res.redirect('/clients');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/clients');
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const client = await this.ClientService.getById(id);
      await this.ClientService.delete(client);
      req.session.messages = [`Se eliminó el client con id ${client.id} y nombre ${client.name}`];
      res.redirect('/clients');
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect('/clients');
    }
  }
};
