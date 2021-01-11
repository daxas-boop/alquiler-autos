const Rent = require('../../entity/rent');
const User = require('../../../user/entity/user');
const RentController = require('../rentController');
const RentError = require('../error/rentError');

const rentServiceMock = {
  getAll: jest.fn(),
  getById: jest.fn(() => Promise.resolve({})),
  save: jest.fn(() => Promise.resolve([])),
  delete: jest.fn(() => Promise.resolve(true)),
};

const carServiceMock = {
  getAll: jest.fn(() => Promise.resolve([])),
  getById: jest.fn(() => Promise.resolve({})),
};

const userServiceMock = {
  getAll: jest.fn(() => Promise.resolve([])),
  getById: jest.fn(() => Promise.resolve({})),
};

const controllerMock = new RentController(rentServiceMock, carServiceMock, userServiceMock);

afterEach(() => {
  Object.values(rentServiceMock).forEach((mockFn) => mockFn.mockClear());
  Object.values(carServiceMock).forEach((mockFn) => mockFn.mockClear());
  Object.values(userServiceMock).forEach((mockFn) => mockFn.mockClear());
});

test('Configura las rutas de los metodos', () => {
  const app = {
    get: jest.fn(),
    post: jest.fn(),
  };
  controllerMock.configureRoutes(app);
  expect(app.get).toHaveBeenCalled();
  expect(app.post).toHaveBeenCalled();
});

test('Index renderea index.njk con las rentas', async () => {
  const renderMock = jest.fn();
  const rents = [new Rent({ id: 1 })];
  rentServiceMock.getAll.mockImplementationOnce(() => Promise.resolve(rents));

  await controllerMock.index({ session: { messages: [] } }, { render: renderMock });

  expect(rentServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('rent/views/index.njk', {
    data: { rents },
    messages: [],
  });
});

test('Create renderea form.njk con los usuarios y autos', async () => {
  const renderMock = jest.fn();
  const users = [{ id: 3 }, { id: 4 }, { id: 5 }];
  const cars = [{ id: 1 }, { id: 2 }, { id: 3 }];
  userServiceMock.getAll.mockImplementationOnce(() => Promise.resolve(users));
  carServiceMock.getAll.mockImplementationOnce(() => Promise.resolve(cars));

  await controllerMock.create({}, { render: renderMock }, {});

  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('rent/views/form.njk', {
    users, cars,
  });
});

test('Create da un error especifico si no hay usuarios', async () => {
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const cars = [{ id: 1 }, { id: 2 }, { id: 3 }];
  carServiceMock.getAll.mockImplementationOnce(() => Promise.resolve(cars));

  try {
    await controllerMock.create({}, { render: renderMock }, nextMock);
  } catch (e) {
    expect(e).toBeInstanceOf(RentError);
  }

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(0);
});

test('Create da un error especifico si no hay autos', async () => {
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const users = [{ id: 3 }, { id: 4 }, { id: 5 }];
  carServiceMock.getAll.mockImplementationOnce(() => Promise.resolve([]));
  userServiceMock.getAll.mockImplementationOnce(() => Promise.resolve(users));

  try {
    await controllerMock.create({}, { render: renderMock }, nextMock);
  } catch (e) {
    expect(e).toBeInstanceOf(RentError);
  }

  expect(carServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(0);
});

test('View renderea view.njk y llama al servicio de renta con el id del request', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
  };

  await controllerMock.view(reqMock, { render: renderMock }, {});

  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('rent/views/view.njk', { rent: {} });
  expect(rentServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
});

test('View agarra el error del servicio y lo pasa a next', async () => {
  const nextMock = jest.fn();
  const reqMockWithoutRentId = {
    params: {},
  };
  const renderMock = jest.fn();
  const error = new Error('test');
  rentServiceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.view(reqMockWithoutRentId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('Edit renderea form.njk, llama al servicio de renta con el id del request', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
  };

  await controllerMock.edit(reqMock, { render: renderMock }, {});

  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('rent/views/form.njk', {
    rent: {},
    cars: [],
    users: [],
  });
  expect(rentServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
});

test('Edit agarra el error del servicio y lo pasa a next', async () => {
  const nextMock = jest.fn();
  const reqMockWithoutRentId = {
    params: {},
  };
  const renderMock = jest.fn();
  const error = new Error('test');
  rentServiceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.edit(reqMockWithoutRentId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('Save llama al servicio de renta con el body da un mensaje y redirecciona a /rents', async () => {
  const redirectMock = jest.fn();
  const rentMock = new Rent({
    id: 1,
    Car: {},
    User: {},
  });
  const reqMock = {
    body: rentMock,
    session: {},
  };

  await controllerMock.save(
    reqMock,
    { redirect: redirectMock },
    {},
  );

  expect(rentServiceMock.save).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.save).toHaveBeenCalledWith(rentMock);
  expect(reqMock.session.messages).toEqual(['Se actualizó el alquiler con id:1']);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/rents');
});

test('Save da un mensaje distinto si la entidad no tiene id', async () => {
  const rentMockWithoutId = new Rent({
    Car: {},
    User: {},
  });
  const rentMock = new Rent({
    id: 1,
    Car: {},
    User: {},
  });
  const redirectMock = jest.fn();
  const reqMock = {
    body: rentMockWithoutId,
    session: {},
  };
  rentServiceMock.save.mockImplementationOnce(() => Promise.resolve(rentMock));

  await controllerMock.save(
    reqMock,
    { redirect: redirectMock },
    {},
  );

  expect(rentServiceMock.save).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.save).toHaveBeenCalledWith(rentMockWithoutId);
  expect(reqMock.session.messages).toEqual(['Se creó un nuevo alquiler con id:1']);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/rents');
});

test('Save captura errores del servicio y los pasa a next', async () => {
  const nextMock = jest.fn();
  const bodyMock = {};
  const redirectMock = jest.fn();
  const error = new Error('Service error');
  rentServiceMock.save.mockImplementationOnce(() => Promise.reject(error));
  await controllerMock.save({ body: bodyMock, session: {} }, { redirect: redirectMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('Delete llama al servicio de renta con el id del request y redirecciona a /rents', async () => {
  const reqMock = {
    params: {
      id: 1,
    },
    session: {},
  };
  const redirectMock = jest.fn();

  await controllerMock.delete(reqMock, { redirect: redirectMock }, {});
  expect(rentServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/rents');
});

test('Delete agarra el error del servicio y lo pasa a next', async () => {
  const reqMockWithoutRentId = {
    params: {},
    session: {},
  };
  const nextMock = jest.fn();
  const renderMock = jest.fn();
  const error = new Error('test');
  rentServiceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.delete(reqMockWithoutRentId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});
