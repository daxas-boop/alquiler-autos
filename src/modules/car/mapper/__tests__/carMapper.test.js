const { fromModelToEntity, fromDataToEntity } = require('../carMapper');
const CarEntity = require('../../entity/car');

test('Convierte un modelo en una entidad', () => {
  expect(
    fromModelToEntity({
      toJSON() {
        return {};
      },
    }),
  ).toBeInstanceOf(CarEntity);
});

test('Convierte data en una entidad', () => {
  expect(
    fromDataToEntity({}),
  ).toBeInstanceOf(CarEntity);
});
