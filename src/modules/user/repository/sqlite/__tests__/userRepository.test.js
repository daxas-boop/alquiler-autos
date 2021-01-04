const { Sequelize } = require('sequelize');
const UserEntity = require('../../../entity/user');
const UserModel = require('../../../model/userModel');
const UserRepository = require('../userRepository');
const UserNotFoundError = require('../../error/userNotFoundError');

const sequelizeInstance = new Sequelize('sqlite::memory');

const sampleUser = new UserEntity({
  name: 'Juan',
  surname: 'Perez',
  documentType: 'DNI',
  documentNumber: '123',
  nationality: 'Argentina',
  address: 'Av. Peron 123',
  phone: '155553333',
  email: 'juan.perez@gmail.com',
  birthdate: '1956-02-12',
});

let repositoryMock;

beforeAll(() => {
  const userModelMock = UserModel.setup(sequelizeInstance);
  repositoryMock = new UserRepository(userModelMock);
});

beforeEach(async (done) => {
  await sequelizeInstance.sync({ force: true });
  done();
});

test('save crea un usuario cuando la entidad no tiene id', async () => {
  const NEW_GENERATED_ID = 1;
  const newUser = await repositoryMock.save(sampleUser);
  expect(newUser.id).toEqual(NEW_GENERATED_ID);
});

test('save actualiza un usuario cuando la entidad tiene id', async () => {
  const NEW_GENERATED_ID = 1;
  const newUser = await repositoryMock.save(sampleUser);
  expect(newUser.id).toEqual(NEW_GENERATED_ID);

  newUser.surname = 'Roberto';
  const modifiedUser = await repositoryMock.save(newUser);
  expect(modifiedUser.id).toEqual(NEW_GENERATED_ID);
  expect(modifiedUser.surname).toEqual('Roberto');
});

test('delete borra un usuario existente y devuelve true', async () => {
  const NEW_GENERATED_ID = 1;
  const newUser = await repositoryMock.save(sampleUser);
  expect(newUser.id).toEqual(NEW_GENERATED_ID);

  await expect(repositoryMock.delete(newUser)).resolves.toEqual(true);
});

test('delete sin parametros da un error especifico', async () => {
  await expect(repositoryMock.delete()).rejects.toThrow(UserNotFoundError);
});

test('delete con un id inexistente devuelve false', async () => {
  await expect(repositoryMock.delete({ id: 1 })).resolves.toEqual(false);
});

test('getById trae un usuario', async () => {
  const NEW_GENERATED_ID = 1;
  const newUser = await repositoryMock.save(sampleUser);
  expect(newUser.id).toEqual(NEW_GENERATED_ID);

  const user = await repositoryMock.getById(NEW_GENERATED_ID);
  expect(user.id).toEqual(NEW_GENERATED_ID);
  expect(user.name).toEqual(sampleUser.name);
});

test('getById con una id inexistente devuelve un error especifico', async () => {
  await expect(repositoryMock.getById(1)).rejects.toThrow(UserNotFoundError);
});

test('getAll trae un array con todos los autos', async () => {
  const NEW_GENERATED_ID = 1;
  const newUser = await repositoryMock.save(sampleUser);
  expect(newUser.id).toEqual(NEW_GENERATED_ID);

  const user = await repositoryMock.getById(NEW_GENERATED_ID);
  await expect(repositoryMock.getAll()).resolves.toEqual([user]);
});
