module.exports = class Rent {
  constructor({
    id,
    carId,
    userId,
    pricePerDay,
    startDate,
    finishDate,
    totalPrice,
    paymentMethod,
    isPaid,
    Car,
    User,
  }) {
    this.id = id;
    this.carId = carId;
    this.userId = userId;
    this.pricePerDay = pricePerDay;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.isPaid = isPaid;
    this.Car = Car;
    this.User = User;
  }
};
