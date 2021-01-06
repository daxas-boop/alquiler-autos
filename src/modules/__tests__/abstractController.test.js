const AbstractController = require('../abstractController');
const AbstractControllerError = require('../error/abstractControllerError');

test('No se puede crear una instancia de AbstractController directamente', () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractController();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractControllerError);
  }
});

test('Se puede crear una nueva clase que hereda AbstractController', () => {
  const Controller = class extends AbstractController {};
  expect(new Controller()).toBeInstanceOf(AbstractController);
});
