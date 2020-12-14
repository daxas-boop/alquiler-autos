const Car = require('../entity/car');

function fromModelToEntity(model) {
  return new Car(model.toJSON());
}

function fromDataToEntity({
  id,
  marca,
  modelo,
  año,
  kilometros,
  color,
  aire,
  pasajeros,
  transmision,
  precio,
  imagen,
}) {
  return new Car({
    id,
    marca,
    modelo,
    año,
    kilometros,
    color,
    aire,
    pasajeros,
    transmision,
    precio,
    imagen,
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
