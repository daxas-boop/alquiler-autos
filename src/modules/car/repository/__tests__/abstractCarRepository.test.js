const AbstractCarRepository = require('../abstractCarRepository');
const AbstractCarRepositoryError = require('../error/abstractCarRepositoryError');

test('No se puede crear una instancia de AbstractCarRepository directamente', () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractCarRepository();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractCarRepositoryError);
  }
});

test('Se puede crear una nueva clase que hereda AbstractCarRepository', () => {
  const Repository = class extends AbstractCarRepository {};
  expect(new Repository()).toBeInstanceOf(AbstractCarRepository);
});
