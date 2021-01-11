const Rent = require('../entity/rent');
const Car = require('../../car/entity/car');
const User = require('../../user/entity/user');

function fromDataToEntity({
  id,
  price_day: pricePerDay,
  start_date: startDate,
  finish_date: finishDate,
  total_price: totalPrice,
  payment_method: paymentMethod,
  is_paid: isPaid,
  car_id: carId,
  user_id: userId,
}) {
  return new Rent({
    id,
    pricePerDay,
    startDate,
    finishDate,
    totalPrice,
    paymentMethod,
    isPaid,
    Car: new Car({ id: carId }),
    User: new User({ id: userId }),
  });
}

function fromModelToEntity({
  id,
  pricePerDay,
  startDate,
  finishDate,
  totalPrice,
  paymentMethod,
  isPaid,
  car,
  user,
}, fromUserModelToEntity, fromCarModelToEntity) {
  const carEntity = car ? fromCarModelToEntity(car) : {};
  const userEntity = user ? fromUserModelToEntity(user) : {};

  return new Rent({
    id,
    pricePerDay,
    startDate,
    finishDate,
    totalPrice,
    paymentMethod,
    isPaid,
    Car: carEntity,
    User: userEntity,
  });
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
