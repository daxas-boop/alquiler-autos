const Rent = require('../entity/rent');

function fromDataToEntity({
  id,
  car_id: carId,
  user_id: userId,
  price_day: pricePerDay,
  start_date: startDate,
  finish_date: finishDate,
  total_price: totalPrice,
  payment_method: paymentMethod,
  is_paid: isPaid,
  Car,
  User,
}) {
  return new Rent({
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
  });
}

function fromModelToEntity({
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
}, fromUserModelToEntity, fromCarModelToEntity) {
  Car = Car ? fromCarModelToEntity(Car) : {};
  User = User ? fromUserModelToEntity(User) : {};
  return new Rent({
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
  });
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
