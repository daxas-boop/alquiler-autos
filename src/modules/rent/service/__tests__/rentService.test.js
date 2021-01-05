const RentService = require('../rentService');
const Rent = require('../../entity/rent');
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError');
const RentNotDefinedError = require('../error/rentNotDefinedError');

const repositoryMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
};

const serviceMock = new RentService(repositoryMock);

test('getAll llama al metodo getAll del repositorio 1 vez', () => {
  serviceMock.getAll();
  expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});

test('getById llama al metodo getById del repositorio 1 vez con la id pasada', () => {
  const ID = 2;
  serviceMock.getById(ID);
  expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
  expect(repositoryMock.getById).toHaveBeenCalledWith(ID);
});

test('getById da un error especifico si no le pasamos una id', () => {
  try {
    serviceMock.getById();
  } catch (e) {
    expect(e).toBeInstanceOf(RentIdNotDefinedError);
  }
});

test('Delete llama al metodo delete del repositorio 1 vez con la renta pasada', () => {
  const rent = new Rent({ id: 1 });
  serviceMock.delete(rent);
  expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
  expect(repositoryMock.delete).toHaveBeenCalledWith(rent);
});

test('Delete da un error especifico si no le pasamos una instancia de renta', () => {
  try {
    serviceMock.delete({ id: 1 });
  } catch (e) {
    expect(e).toBeInstanceOf(RentNotDefinedError);
  }
});

test('Save llama al metodo save del repositorio 1 vez con la renta pasada', () => {
  const rent = new Rent({
    startDate: new Date(2020, 3, 5),
    finishDate: new Date(2020, 5, 5),
    Car: {
      priceDay: 200,
    },
  });

  serviceMock.save(rent);
  expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  expect(repositoryMock.save).toHaveBeenCalledWith(rent);
});

test('Save da un error especifico si no le pasamos una instancia de renta', () => {
  try {
    serviceMock.save({ id: 1 });
  } catch (e) {
    expect(e).toBeInstanceOf(RentNotDefinedError);
  }
});
