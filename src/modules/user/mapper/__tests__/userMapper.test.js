const { fromDataToEntity, fromModelToEntity } = require('../userMapper');
const User = require('../../entity/user');

test('Convierte un modelo en una entidad', () => {
  expect(
    fromModelToEntity({
      toJSON() {
        return {};
      },
    }),
  ).toBeInstanceOf(User);
});

test('Convierte data a una entidad', () => {
  expect(
    fromDataToEntity({}),
  ).toBeInstanceOf(User);
});
