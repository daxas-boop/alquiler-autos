const { Sequelize } = require('sequelize');
const CarRepository = require('../carRepository');
const CarNotFoundError = require('../../error/carNotFoundError');
const CarModel = require('../../../model/carModel');
const CarEntity = require('../../../entity/car');

const sequelizeInstance = new Sequelize('sqlite::memory');

/**
 * @type CarRepository
 */
let repositoryMock;

const sampleCar = new CarEntity({
  brand: 'Renault',
  model: '12',
  year: '1983',
  mileage: '160000',
  color: 'Celeste',
  airConditioning: '0',
  passengers: '4',
  transmission: 'manual',
  priceDay: '350',
  image: 'public/img/1608601639951.jpg',
});

beforeAll(() => {
  const carModelMock = CarModel.setup(sequelizeInstance);
  repositoryMock = new CarRepository(carModelMock);
});

beforeEach(async (done) => {
  await sequelizeInstance.sync({ force: true });
  done();
});

test('Crea un auto cuando la entidad no tiene id', async () => {
  const NEW_GENERATED_ID = 1;
  const newCar = await repositoryMock.save(sampleCar);
  expect(newCar.id).toEqual(NEW_GENERATED_ID);
});

test('Actualiza el auto cuando la entidad tiene id', async () => {
  const NEW_GENERATED_ID = 1;
  const newCar = await repositoryMock.save(sampleCar);
  expect(newCar.id).toEqual(NEW_GENERATED_ID);

  newCar.brand = 'Peugeot';
  const modifiedCar = await repositoryMock.save(newCar);
  expect(modifiedCar.id).toEqual(NEW_GENERATED_ID);
  expect(modifiedCar.brand).toEqual('Peugeot');
});

test('Borra un auto existente devuelve true', async () => {
  const NEW_GENERATED_ID = 1;
  const newCar = await repositoryMock.save(sampleCar);
  expect(newCar.id).toEqual(NEW_GENERATED_ID);
  await expect(repositoryMock.delete(newCar)).resolves.toEqual(true);
});

test('Borrar un auto sin parametros da un error especifico', async () => {
  await expect(repositoryMock.delete()).rejects.toThrow(CarNotFoundError);
});

test('Borrar un auto con un id inexistente devuelve false', async () => {
  await expect(repositoryMock.delete({ id: 1 })).resolves.toEqual(false);
});

test('Traer un auto por id te devuelve un auto', async () => {
  const NEW_GENERATED_ID = 1;
  const newCar = await repositoryMock.save(sampleCar);
  expect(newCar.id).toEqual(NEW_GENERATED_ID);

  const car = await repositoryMock.getById(NEW_GENERATED_ID);
  expect(car.id).toEqual(NEW_GENERATED_ID);
  expect(car.brand).toEqual(sampleCar.brand);
  expect(car).toBeInstanceOf(CarEntity);
});

test('Traer un auto con una id inexistente devuelve un error especifico', async () => {
  await expect(repositoryMock.getById(1)).rejects.toThrow(CarNotFoundError);
});

test('Traer todos los autos devuelve un array de autos', async () => {
  const NEW_GENERATED_ID = 1;
  const newCar = await repositoryMock.save(sampleCar);
  expect(newCar.id).toEqual(NEW_GENERATED_ID);

  const car = await repositoryMock.getById(NEW_GENERATED_ID);
  await expect(repositoryMock.getAll()).resolves.toEqual([car]);
});
