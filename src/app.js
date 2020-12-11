require('dotenv').config();
const express = require('express');

const app = express();
const nunjucks = require('nunjucks');
const dependecyInjectionConfig = require('./config/di');
const { init: initCarModule } = require('./modules/car/module');

nunjucks.configure('src/modules', {
  autoescape: true,
  express: app,
});

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

const container = dependecyInjectionConfig();
app.use(container.get('Session'));
initCarModule(container, app);

const CarController = container.get('CarController');
app.get('/', CarController.index.bind(CarController));

const PUERTO = process.env.PORT || 8080;

app.listen(PUERTO, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${PUERTO}`);
});
