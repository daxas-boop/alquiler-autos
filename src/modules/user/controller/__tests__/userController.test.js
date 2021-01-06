const UserController = require('../userController');
const User = require('../../entity/user');

const serviceMock = {
  save: jest.fn(),
  delete: jest.fn(() => Promise.resolve(true)),
  getById: jest.fn(() => Promise.resolve({})),
  getAll: jest.fn(() => Promise.resolve([])),
};

const controllerMock = new UserController(serviceMock);

afterEach(() => {
  Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
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

test('Index renderea index.njk con la data de los usuarios', async () => {
  const renderMock = jest.fn();
  const users = await serviceMock.getAll();
  await controllerMock.index({ session: { messages: [] } }, { render: renderMock });
  expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('user/views/index.njk', {
    data: { users },
    messages: [],
  });
});

test('Create renderea form.njk', () => {
  const renderMock = jest.fn();
  controllerMock.create({}, { render: renderMock });
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('user/views/form.njk');
});

test('View renderea view.njk y llama al servicio con la id del request', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
  };
  await controllerMock.view(reqMock, { render: renderMock }, {});
  expect(serviceMock.getById).toHaveBeenCalledTimes(1);
  expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('user/views/view.njk', { user: {} });
});

test('View tira un error si no hay id en el request', async () => {
  const reqMockWithoutUserId = {
    params: {},
  };
  const nextMock = jest.fn();
  await controllerMock.view(reqMockWithoutUserId, {}, nextMock);
  expect(nextMock).toHaveBeenCalledTimes(1);
});

test('Edit renderea form.njk y llama al servicio con la id del request', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
  };
  await controllerMock.edit(reqMock, { render: renderMock }, {});
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('user/views/form.njk', { user: {} });
  expect(serviceMock.getById).toHaveBeenCalledTimes(1);
  expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
});

test('Edit tira un error si no hay id en el requret', async () => {
  const reqMockWithoutUserId = {
    params: {},
  };
  const nextMock = jest.fn();
  await controllerMock.edit(reqMockWithoutUserId, {}, nextMock);
  expect(nextMock).toHaveBeenCalledTimes(1);
});

test('Save llama al servicio con el body y redirecciona a /users', async () => {
  const redirectMock = jest.fn();
  const nextMock = jest.fn();
  const bodyMock = new User({
    id: 1,
    name: undefined,
    surname: undefined,
    documentType: undefined,
    documentNumber: undefined,
    nationality: undefined,
    address: undefined,
    phone: undefined,
    email: undefined,
    birthdate: undefined,
  });

  await controllerMock.save(
    { body: bodyMock, session: {} },
    { redirect: redirectMock },
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/users');
});

test('Save tira error si no se pasa data en el body', async () => {
  const nextMock = jest.fn();
  const bodyMock = {};

  await controllerMock.save(
    { body: bodyMock },
    {},
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
  expect(nextMock).toHaveBeenCalledTimes(1);
});

test('Delete pasa el auto al servicio y redirecciona a /users', async () => {
  const userMock = new User({ id: 1 });
  serviceMock.getById.mockImplementationOnce(() => Promise.resolve(userMock));
  const reqMock = {
    params: {
      id: 1,
    },
    session: {},
  };
  const redirectMock = jest.fn();
  const nextMock = jest.fn();

  await controllerMock.delete(reqMock, { redirect: redirectMock }, nextMock);

  expect(serviceMock.delete).toHaveBeenCalledTimes(1);
  expect(serviceMock.delete).toHaveBeenCalledWith(userMock);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/users');
});

test('Delete tira error cuando no hay id en el request', async () => {
  const reqMockWithoutUserId = {
    params: {},
  };
  const nextMock = jest.fn();
  await controllerMock.delete(reqMockWithoutUserId, {}, nextMock);
  expect(nextMock).toHaveBeenCalledTimes(1);
});
