const AbstractRentRepository = require('../abstractRentRepository');
const AbstractRentRepositoryError = require('../error/abstractRentRepositoryError');

test('No se puede crear una instancia directa de AbstractRentRepository', () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractRentRepository();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractRentRepositoryError);
  }
});

test('Se puede crear una instancia que herede de AbstractRentRepository', () => {
  const Repository = class extends AbstractRentRepository {};
  expect(new Repository()).toBeInstanceOf(AbstractRentRepository);
});
