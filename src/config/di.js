const {
  default: DIContainer, object, factory, get,
} = require('rsdi');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require('sequelize');
const {
  UserController,
  UserService,
  UserRepository,
  UserModel,
} = require('../modules/user/module');
const {
  CarController, CarService, CarRepository, CarModel,
} = require('../modules/car/module');
const {
  RentController,
  RentService,
  RentRepository,
  RentModel,
} = require('../modules/rent/module');

function configureSequelize() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
  });
  return sequelize;
}

function configureSequelizeSession() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SESSION_DB_PATH,
  });

  return sequelize;
}

/**
 * @param {DIContainer} container
 */
function configureCarModel(container) {
  CarModel.setup(container.get('Sequelize'));
  return CarModel;
}

/**
 * @param {DIContainer} container
 */
function configureUserModel(container) {
  UserModel.setup(container.get('Sequelize'));
  return UserModel;
}

/**
 * @param {DIContainer} container
 */
function configureRentModel(container) {
  RentModel.setup(container.get('Sequelize'));
  RentModel.setupAssociations(container.get('CarModel'), container.get('UserModel'));
  return RentModel;
}

/**
 * @param {DIContainer} container
 */
function configureSession(container) {
  const ONE_WEEK_IN_SECONDS = 604800;

  const sequelize = container.get('SessionSequelize');
  const options = {
    store: new SequelizeStore({ db: sequelize }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS },
  };

  return session(options);
}

function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, process.env.UPLOAD_IMG_DIR);
    },
    filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  return multer({ storage });
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
  container.addDefinitions({
    SessionSequelize: factory(configureSequelizeSession),
    Session: factory(configureSession),
    Multer: factory(configureMulter),
    Sequelize: factory(configureSequelize),
  });
}

/**
 * @param {DIContainer} container
 */
function addCarModuleDefinitions(container) {
  container.addDefinitions({
    CarController: object(CarController).construct(get('CarService'), get('Multer')),
    CarService: object(CarService).construct(get('CarRepository')),
    CarRepository: object(CarRepository).construct(get('CarModel')),
    CarModel: factory(configureCarModel),
  });
}

/**
 * @param {DIContainer} container
 */
function addUserModuleDefinitions(container) {
  container.addDefinitions({
    UserController: object(UserController).construct(get('UserService')),
    UserService: object(UserService).construct(get('UserRepository')),
    UserRepository: object(UserRepository).construct(get('UserModel')),
    UserModel: factory(configureUserModel),
  });
}

/**
 * @param {DIContainer} container
 */
function addRentModuleDefinitions(container) {
  container.addDefinitions({
    RentController: object(RentController).construct(
      get('RentService'),
      get('CarService'),
      get('UserService'),
    ),
    RentService: object(RentService).construct(get('RentRepository')),
    RentRepository: object(RentRepository).construct(
      get('RentModel'),
      get('CarModel'),
      get('UserModel'),
    ),
    RentModel: factory(configureRentModel),
  });
}

/**
 * @returns {DIContainer} container
 */
module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  addUserModuleDefinitions(container);
  addRentModuleDefinitions(container);
  return container;
};
