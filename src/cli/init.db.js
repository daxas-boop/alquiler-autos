require('dotenv').config();
const configureDependencyInjection = require('../config/di');

const container = configureDependencyInjection();

/**
 * @type {import('sequelize').Sequelize} mainDb
 */
const mainDb = container.get('Sequelize');

container.get('CarModel');

mainDb.sync();

/**
 * @type {import('sequelize').Sequelize} sessionDb
 */
const sessionDb = container.get('SessionSequelize');
container.get('Session');
sessionDb.sync();
