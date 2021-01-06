const AbstractUserRepository = require('../abstractUserRepository');
const AbstractUserRepositoryError = require('../error/abstractUserRepositoryError');

test('No se puede crear una instancia directamente de AbstractUserRepository', () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractUserRepository();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractUserRepositoryError);
  }
});

test('Se puede crear una instancia que herede de AbstractUserRepository', () => {
  const Repo = class extends AbstractUserRepository {};
  expect(new Repo()).toBeInstanceOf(AbstractUserRepository);
});
