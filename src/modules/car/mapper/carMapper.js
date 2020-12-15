const Car = require('../entity/car');

function fromModelToEntity(model) {
  return new Car(model.toJSON());
}

function fromDataToEntity({
  id,
  brand,
  model,
  year,
  mileage,
  color,
  air_conditioning: airConditioning,
  passengers,
  transmission,
  price_day: priceDay,
  image,
}) {
  return new Car({
    id,
    brand,
    model,
    year,
    mileage,
    color,
    airConditioning,
    passengers,
    transmission,
    priceDay,
    image,
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
