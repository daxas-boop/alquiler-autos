require('dotenv').config();
const express = require('express');

const app = express();
const nunjucks = require('nunjucks');
const dependecyInjectionConfig = require('./config/di');
const { init: initCarModule } = require('./modules/car/module');
const { init: initUserModule } = require('./modules/user/module');
const { init: initRentModule } = require('./modules/rent/module');

nunjucks.configure('src/modules', {
  autoescape: true,
  express: app,
});

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

const container = dependecyInjectionConfig();
app.use(container.get('Session'));

initCarModule(container, app);
initUserModule(container, app);
initRentModule(container, app);

const CarController = container.get('CarController');
app.get('/', CarController.index.bind(CarController));

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(500);
  res.render('views/layout/error.html', { error });
});

const PUERTO = process.env.PORT || 8080;
app.listen(PUERTO, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${PUERTO}`);
});
