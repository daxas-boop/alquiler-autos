const Car = require('../entity/car');

function fromDbToEntity({
  id,
  marca,
  modelo,
  año,
  kilometros,
  color,
  aire,
  pasajeros,
  transmision,
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
    imagen,
  });
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
    imagen,
  });
}

module.exports = {
  fromDbToEntity,
  fromDataToEntity,
};
