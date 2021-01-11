const CarController = require('../carController');
const Car = require('../../entity/car');

const serviceMock = {
  save: jest.fn(),
  delete: jest.fn(() => Promise.resolve(true)),
  getById: jest.fn(() => Promise.resolve({})),
  getAll: jest.fn(() => Promise.resolve([])),
};

const uploadMock = {
  single: jest.fn(),
};

const controller = new CarController(serviceMock, uploadMock);

afterEach(() => {
  Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
});

test('Configura las rutas de los metodos', () => {
  const app = {
    get: jest.fn(),
    post: jest.fn(),
  };
  controller.configureRoutes(app);
  expect(app.get).toHaveBeenCalled();
  expect(app.post).toHaveBeenCalled();
  expect(uploadMock.single).toHaveBeenCalled();
});

test('Index renderea index.njk con data de clubes', async () => {
  const renderMock = jest.fn();
  const cars = await serviceMock.getAll();
  await controller.index({ session: { messages: [] } }, { render: renderMock });

  expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('car/views/index.njk', {
    data: { cars },
    messages: [],
  });
});

test('Create renderea form.njk', async () => {
  const renderMock = jest.fn();

  await controller.create({}, { render: renderMock });

  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenLastCalledWith('car/views/form.njk');
});

test('View renderea view.njk y llama al servicio con la id del request', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
  };

  await controller.view(reqMock, { render: renderMock }, {});

  expect(serviceMock.getById).toHaveBeenCalledTimes(1);
  expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    'car/views/view.njk', { car: {} },
  );
});

test('View agarra el error del servicio y lo pasa a next', async () => {
  const reqMockWithoutCarId = {
    params: {},
  };
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));
  await controller.view(reqMockWithoutCarId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('Edit renderea form.njk y llama al servicio con la id del request', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 2,
    },
  };

  await controller.edit(reqMock, { render: renderMock }, {});

  expect(serviceMock.getById).toHaveBeenCalledTimes(1);
  expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith(
    'car/views/form.njk', { car: {} },
  );
});

test('Edit agarra el error del servicio y lo pasa a next', async () => {
  const reqMockWithoutCarId = {
    params: {},
  };
  const nextMock = jest.fn();
  const renderMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controller.edit(reqMockWithoutCarId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('Delete pasa el auto al servicio y redirecciona a /cars', async () => {
  const carMock = new Car({ id: 1 });
  serviceMock.getById.mockImplementationOnce(() => Promise.resolve(carMock));
  const redirectMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
    session: {},
  };
  const nextMock = jest.fn();
  await controller.delete(reqMock, { redirect: redirectMock }, nextMock);

  expect(serviceMock.delete).toHaveBeenCalledTimes(1);
  expect(serviceMock.delete).toHaveBeenCalledWith(carMock);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/cars');
});

test('Delete agarra el error del servicio y los pasa a next', async () => {
  const reqMockWithoutCarId = {
    params: {},
  };
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controller.delete(reqMockWithoutCarId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
  expect(nextMock).toHaveBeenCalledTimes(1);
});

test('Save llama al servicio con el body, da un mensaje y redirecciona a /cars', async () => {
  const redirectMock = jest.fn();
  const nextMock = jest.fn();
  const FAKE_CREST_URL = 'test/url.png';
  const bodyMock = new Car({
    id: 1,
    brand: 'Renault',
    image: 'test/url.png',
  });
  const reqMock = {
    body: bodyMock,
    file: { path: FAKE_CREST_URL },
    session: {},
  };

  await controller.save(
    reqMock,
    { redirect: redirectMock },
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
  expect(reqMock.session.messages).toEqual(['El auto con ID 1 y marca Renault se actualizó']);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/cars');
});

test('Save da un mensaje distinto si la entidad no tiene id', async () => {
  const redirectMock = jest.fn();
  const nextMock = jest.fn();
  const FAKE_CREST_URL = 'test/url.png';

  const bodyMock = new Car({
    id: 1,
    brand: 'Renault',
    image: 'test/url.png',
  });

  const bodyMockWithoutId = new Car({
    image: 'test/url.png',
  });

  const reqMock = {
    body: bodyMockWithoutId,
    file: { path: FAKE_CREST_URL },
    session: {},
  };

  serviceMock.save.mockImplementationOnce(() => Promise.resolve(bodyMock));
  await controller.save(
    reqMock,
    { redirect: redirectMock },
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMockWithoutId);
  expect(reqMock.session.messages).toEqual(['Se creó un auto con ID 1 y marca Renault']);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/cars');
});

test('Save captura errores del servicio y los pasa a next', async () => {
  const nextMock = jest.fn();
  const bodyMock = {};
  const redirectMock = jest.fn();
  const error = new Error('Service error');
  serviceMock.save.mockImplementationOnce(() => Promise.reject(error));
  await controller.save(
    { body: bodyMock, session: {} },
    { redirect: redirectMock },
    nextMock,
  );

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});
