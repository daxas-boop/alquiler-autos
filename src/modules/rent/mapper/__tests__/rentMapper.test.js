const { fromModelToEntity, fromDataToEntity } = require('../rentMapper');
const RentEntity = require('../../entity/rent');

test('fromDataToEntity convierte data a una entidad', () => {
  expect(
    fromDataToEntity({}),
  ).toBeInstanceOf(RentEntity);
});

test('fromModeltoEntity convierte un modelo a una entidad', () => {
  expect(
    fromModelToEntity({}),
  ).toBeInstanceOf(RentEntity);
});

test('fromModelToEntity llama a las funciones pasadas como parametros cuando se pasa un auto y un usuario', () => {
  const sampleModel = {
    id: 1,
    pricePerDay: undefined,
    startDate: undefined,
    finishDate: undefined,
    totalPrice: undefined,
    paymentMethod: undefined,
    isPaid: undefined,
    car: { id: 1 },
    user: { id: 1 },
  };

  const fromCarModelToEntityMock = jest.fn();
  const fromUserModelToEntityMock = jest.fn();

  expect(fromModelToEntity(
    sampleModel, fromCarModelToEntityMock, fromUserModelToEntityMock,
  )).toBeInstanceOf(RentEntity);

  expect(fromCarModelToEntityMock).toHaveBeenCalledTimes(1);
  expect(fromUserModelToEntityMock).toHaveBeenCalledTimes(1);
});
