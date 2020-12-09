const {
  default: DIContainer, object, factory, get,
} = require('rsdi');
const Sqlite3Database = require('better-sqlite3');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { CarController, CarService, CarRepository } = require('../modules/car/module');

function configureSession() {
  const ONE_WEEK_IN_SECONDS = 604800;
  const options = {
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
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  return multer({ storage });
}

function configureSqlite3() {
  return new Sqlite3Database();
}

function addCommonDefinitions(container) {
  container.addDefinitions({
    Session: factory(configureSession),
    Multer: factory(configureMulter),
    DatabaseAdapter: factory(configureSqlite3),
  });
}

function addCarModuleDefinitions(container) {
  container.addDefinitions({
    CarController: object(CarController).construct(get('CarService', 'Multer')),
    CarService: object(CarService).construct(get('CarRepository')),
    CarRepository: object(CarRepository).construct(get('DatabaseAdapter')),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);

  return container;
};
