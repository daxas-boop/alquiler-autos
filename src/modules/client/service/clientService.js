const ClientNotDefinedError = require('./error/clientNotDefinedError');
const IdNotDefinedError = require('./error/idNotDefinedError');
const Client = require('../entity/client');

module.exports = class ClientService {
  constructor(ClientRepository) {
    this.ClientRepository = ClientRepository;
  }

  getAll() {
    return this.ClientRepository.getAll();
  }

  /**
   * @param {import('../entity/client')} client
   */
  save(client) {
    if (!client) {
      throw new ClientNotDefinedError();
    }

    return this.ClientRepository.save(client);
  }

  getById(id) {
    if (!id) {
      throw new IdNotDefinedError();
    }

    return this.ClientRepository.getById(id);
  }

  delete(client) {
    if (!(client instanceof Client)) {
      throw new ClientNotDefinedError();
    }
    return this.ClientRepository.delete(client);
  }
};
