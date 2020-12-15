const ClientController = require('./controller/clientController');
const ClientService = require('./service/clientService');
const ClientRepository = require('./repository/sqlite/clientRepository');
const ClientModel = require('./model/clientModel');

/**
 * @param {import('rsdi')DIContainer} container
 * @param {import('express').Application} app
 */
function init(container, app) {
  const controller = container.get('ClientController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  ClientController,
  ClientService,
  ClientRepository,
  ClientModel,
};
