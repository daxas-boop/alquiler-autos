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

test('View agarra el error del servicio y los pasa a next', async () => {
  const reqMockWithoutUserId = {
    params: {},
  };
  const nextMock = jest.fn();
  const renderMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.view(reqMockWithoutUserId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
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
  const renderMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.edit(reqMockWithoutUserId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('Save llama al servicio con el body, da un mensaje y redirecciona a /users', async () => {
  const redirectMock = jest.fn();
  const nextMock = jest.fn();
  const bodyMock = new User({
    id: 1,
    name: 'Pepe',
  });
  const reqMock = {
    body: bodyMock,
    session: {},
  };

  await controllerMock.save(
    reqMock,
    { redirect: redirectMock },
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
  expect(reqMock.session.messages).toEqual(['El usuario con ID 1 y nombre Pepe se actualizó']);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/users');
});

test('Save da un mensaje diferente si la entidad no tiene id', async () => {
  const redirectMock = jest.fn();
  const nextMock = jest.fn();

  const bodyMock = new User({
    id: 1,
    name: 'Pepe',
  });

  const bodyMockWithoutId = new User({
    name: 'Pepe',
  });

  const reqMock = {
    body: bodyMockWithoutId,
    session: {},
  };

  serviceMock.save.mockImplementationOnce(() => Promise.resolve(bodyMock));
  await controllerMock.save(
    reqMock,
    { redirect: redirectMock },
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMockWithoutId);
  expect(reqMock.session.messages).toEqual(['Se creó un usuario con ID 1 y nombre Pepe']);
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/users');
});

test('Save agarra el error del servicio y lo pasa a next', async () => {
  const nextMock = jest.fn();
  const bodyMock = {};
  const redirectMock = jest.fn();
  const error = new Error('Save error');
  serviceMock.save.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.save(
    { body: bodyMock },
    { redirect: redirectMock },
    nextMock,
  );

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(bodyMock);
  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
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

test('Delete agarra el error del servicio y lo pasa a next', async () => {
  const reqMockWithoutUserId = {
    params: {},
  };
  const nextMock = jest.fn();
  const renderMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.delete(reqMockWithoutUserId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});
