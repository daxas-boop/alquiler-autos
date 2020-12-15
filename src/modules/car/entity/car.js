module.exports = class Car {
  constructor({
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
  }) {
    this.id = id;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.mileage = mileage;
    this.color = color;
    this.airConditioning = airConditioning;
    this.passengers = passengers;
    this.transmission = transmission;
    this.priceDay = priceDay;
    this.image = image;
  }
};
