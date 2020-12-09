const express = require('express');

const app = express();
const nunjucks = require('nunjucks');
const dependecyInjectionConfig = require('./config/di');
const { init: initCarModule } = require('./modules/car/module');

nunjucks.configure('src/modules', {
  autoescape: true,
  express: app,
});

const container = dependecyInjectionConfig();
initCarModule(container, app);

const CarController = container.get('CarController');
app.get('/', CarController.index.bind(CarController));

const PUERTO = 8080;

app.listen(PUERTO, () => {
  console.log(`App listening at http://localhost:${PUERTO}`);
});
