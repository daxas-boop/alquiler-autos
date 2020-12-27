const CarService = require('../carService');
const Car = require('../../entity/car');
const CarNotDefinedError = require('../error/carNotDefinedError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

const repositoryMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const service = new CarService(repositoryMock);

test('Guardar un auto llama al metodo save del repositorio 1 vez', () => {
  service.save({});
  expect(repositoryMock.save).toHaveBeenCalledTimes(1);
});

test('Llamar a guardar un auto sin pasar un auto da un error especifico', async () => {
  await expect(service.save).rejects.toThrowError(CarNotDefinedError);
});

test('Borrar un auto llama al metodo delete del repositorio 1 vez', () => {
  service.delete(new Car({ id: 1 }));
  expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
});

test('Borrar un auto sin pasar una instancia de "Car" da un error especifico', () => {
  service.delete({ id: 1 });
  expect(service.delete).rejects.toThrowError(CarNotDefinedError);
});

test('Consultar auto por id llama al metodo getById del repositorio 1 vez', () => {
  service.getById(1);
  expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
});

test('Consultar auto por id sin pasar un auto da un error especifico', async () => {
  await expect(service.getById).rejects.toThrowError(CarIdNotDefinedError);
});

test('Consultar todos los equipos llama al metodo getAll del repositorio 1 vez', () => {
  service.getAll();
  expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});
