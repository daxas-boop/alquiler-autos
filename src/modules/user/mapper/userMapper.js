const User = require('../entity/user');

function fromModelToEntity(model) {
  return new User(model.toJSON());
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
  return new User({
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
