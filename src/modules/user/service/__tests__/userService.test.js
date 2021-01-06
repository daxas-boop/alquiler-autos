const UserService = require('../userService');
const UserEntity = require('../../entity/user');
const UserNotDefinedError = require('../error/userNotDefinedError');
const IdNotDefinedError = require('../error/idNotDefinedError');

const repositoryMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const serviceMock = new UserService(repositoryMock);

test('Guardar un usuario llama al metodo save del repositorio 1 vez', () => {
  serviceMock.save({});
  expect(repositoryMock.save).toHaveBeenCalledTimes(1);
});

test('Guardar un usuario sin parametros da un error espcifico', () => {
  try {
    serviceMock.save();
  } catch (e) {
    expect(e).toBeInstanceOf(UserNotDefinedError);
  }
});

test('Borrar un usuario llama al metodo delete del repositorio 1 vez', () => {
  serviceMock.delete(new UserEntity({ id: 1 }));
  expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
});

test('Borrar un usuario sin una instancia de User da un error especifico', () => {
  try {
    serviceMock.delete({ id: 1 });
  } catch (e) {
    expect(e).toBeInstanceOf(UserNotDefinedError);
  }
});

test('Consultar todos los usuarios llama al metodo getAll del repositorio 1 vez', () => {
  serviceMock.getAll();
  expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});

test('Consultar un usuario por id llama al metodo getById del repositorio 1 vez', () => {
  serviceMock.getById(1);
  expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
});

test('Consultar un usuario por id sin pasar una id da un error especifico', () => {
  try {
    serviceMock.getById();
  } catch (e) {
    expect(e).toBeInstanceOf(IdNotDefinedError);
  }
});
