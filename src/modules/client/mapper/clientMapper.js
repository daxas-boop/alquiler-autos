const Client = require('../entity/client');

function fromModelToEntity(model) {
  return new Client(model.toJSON());
}

function fromDataToEntity({
  id,
  name,
  surname,
  document_type: documentType,
  document_number: documentNumber,
  nationality,
  address,
  phone,
  email,
  birthdate,
}) {
  return new Client({
    id,
    name,
    surname,
    documentType,
    documentNumber,
    nationality,
    address,
    phone,
    email,
    birthdate,
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
