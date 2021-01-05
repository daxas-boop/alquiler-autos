const { Sequelize } = require('sequelize');
const RentRepository = require('../rentRepository');
const Rent = require('../../../entity/rent');
const User = require('../../../../user/entity/user');
const Car = require('../../../../car/entity/car');
const RentModel = require('../../../model/rentModel');
const CarModel = require('../../../../car/model/carModel');
const UserModel = require('../../../../user/model/userModel');
const RentNotFoundError = require('../../error/rentNotFoundError');

const sequelizeInstance = new Sequelize('sqlite::memory');

const sampleCar = new Car({
  airConditioning: 0,
  brand: 'Renault',
  color: 'Celeste',
  id: 1,
  image: 'public/img/1608601639951.jpg',
  mileage: 160000,
  model: '12',
  passengers: 4,
  priceDay: 350,
  transmission: 'manual',
  year: 1983,
});

const sampleUser = new User({
  address: 'Av. Peron 123',
  birthdate: new Date(1956, 1, 12),
  documentNumber: 123,
  documentType: 'DNI',
  email: 'juan.perez@gmail.com',
  id: 1,
  name: 'Juan',
  nationality: 'Argentina',
  phone: '155553333',
  surname: 'Perez',
});

const sampleRent = new Rent({
  pricePerDay: 200,
  startDate: new Date(1956, 1, 12),
  finishDate: new Date(1956, 1, 12),
  totalPrice: 200,
  paymentMethod: 'tarjeta',
  isPaid: true,
  Car: { id: 1 },
  User: { id: 1 },
});

let repositoryMock;
let carModelMock;
let userModelMock;

beforeAll(() => {
  carModelMock = CarModel.setup(sequelizeInstance);
  userModelMock = UserModel.setup(sequelizeInstance);
  const rentModelMock = RentModel.setup(sequelizeInstance);
  rentModelMock.setupAssociations(carModelMock, userModelMock);

  repositoryMock = new RentRepository(rentModelMock, carModelMock, userModelMock);
});

beforeEach(async (done) => {
  await sequelizeInstance.sync({ force: true });
  done();
});

test('Save crea una renta cuando la entidad no tiene id', async () => {
  await carModelMock.create(sampleCar);
  await userModelMock.create(sampleUser);
  const NEW_GENERATED_ID = 1;
  const newRent = await repositoryMock.save(sampleRent);
  expect(newRent.id).toEqual(NEW_GENERATED_ID);
});

test('Save actualiza una renta cuando la entidad tiene id', async () => {
  await carModelMock.create(sampleCar);
  await userModelMock.create(sampleUser);
  const NEW_GENERATED_ID = 1;
  const newRent = await repositoryMock.save(sampleRent);
  expect(newRent.id).toEqual(NEW_GENERATED_ID);

  newRent.pricePerDay = 3111;
  const modifiedRent = await newRent.save();
  expect(modifiedRent.id).toEqual(NEW_GENERATED_ID);
  expect(modifiedRent.pricePerDay).toEqual(3111);
});

test('getAll trae un array con todas las rentas incluyendo su usuario y auto', async () => {
  await carModelMock.create(sampleCar);
  await userModelMock.create(sampleUser);
  const NEW_GENERATED_ID = 1;
  const newRent = await repositoryMock.save(sampleRent);
  expect(newRent.id).toEqual(NEW_GENERATED_ID);

  const sampleRentWithCarAndUser = new Rent({
    pricePerDay: 200,
    startDate: new Date(1956, 1, 12),
    finishDate: new Date(1956, 1, 12),
    totalPrice: 200,
    paymentMethod: 'tarjeta',
    id: 1,
    isPaid: true,
    Car: sampleCar,
    User: sampleUser,
  });

  const rents = await repositoryMock.getAll();
  expect(rents).toStrictEqual(([sampleRentWithCarAndUser]));
});

test('getById trae una renta con la id pasada', async () => {
  await carModelMock.create(sampleCar);
  await userModelMock.create(sampleUser);
  const NEW_GENERATED_ID = 1;
  const newRent = await repositoryMock.save(sampleRent);
  expect(newRent.id).toEqual(NEW_GENERATED_ID);

  const rent = await repositoryMock.getById(NEW_GENERATED_ID);
  expect(rent.id).toEqual(NEW_GENERATED_ID);
  expect(rent.pricePerDay).toEqual(sampleRent.pricePerDay);
});

test('getById da un error especifico si la id no existe', async () => {
  await expect(repositoryMock.getById(1)).rejects.toThrow(RentNotFoundError);
});

test('Delete devuelve true si borramos una renta', async () => {
  await carModelMock.create(sampleCar);
  await userModelMock.create(sampleUser);
  const NEW_GENERATED_ID = 1;
  const newRent = await repositoryMock.save(sampleRent);
  expect(newRent.id).toEqual(NEW_GENERATED_ID);

  await expect(repositoryMock.delete(newRent)).resolves.toEqual(true);
});

test('Delete devuelve falso si la id de la renta no existe', async () => {
  const rent = new Rent({ id: 52 });
  await expect(repositoryMock.delete(rent)).resolves.toEqual(false);
});

test('Delete da un error especifico si no pasamos una renta', async () => {
  await expect(repositoryMock.delete()).rejects.toThrow(RentNotFoundError);
});
