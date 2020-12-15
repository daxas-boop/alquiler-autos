const AbstractClientRepository = require('../abstractClientRepository');
const ClientNotFoundError = require('../error/clientNotFoundError');
const { fromModelToEntity } = require('../../mapper/clientMapper');

module.exports = class ClientRepository extends AbstractClientRepository {
  constructor(ClientModel) {
    super();
    this.ClientModel = ClientModel;
  }

  async getAll() {
    const clients = await this.ClientModel.findAll();
    return clients.map(fromModelToEntity);
  }

  async save(client) {
    let savedModel;
    if (client.id) {
      savedModel = await this.ClientModel.build(client, { isNewRecord: false }).save();
    } else {
      savedModel = await this.ClientModel.create(client);
    }
    return savedModel;
  }

  /**
   *
   * @param {String} id
   */
  async getById(id) {
    const clientModel = await this.ClientModel.findByPk(id);

    if (!clientModel) {
      throw new ClientNotFoundError(`El cliente con ID ${id} no se encontró.`);
    }

    return fromModelToEntity(clientModel);
  }

  async delete(client) {
    if (!client || !client.id) {
      throw new ClientNotFoundError();
    }
    return Boolean(this.ClientModel.destroy({ where: { id: client.id } }));
  }
};
