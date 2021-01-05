module.exports = class Rent {
  constructor({
    id,
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
    this.pricePerDay = pricePerDay;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.isPaid = isPaid;
    this.Car = Car;
    this.User = User;
  }

  calculateTotalPrice(carEntity) {
    const milisecondDiff = new Date(this.finishDate).getTime() - new Date(this.startDate).getTime();
    const dayDiff = Math.round(milisecondDiff / (1000 * 3600 * 24));
    this.totalPrice = dayDiff * carEntity.priceDay;
  }
};
