const knex = require('knex');
const configuration = require('../../knexfile');

const connection = knex(configuration.development); // Para produção seria "configuration.production"

module.exports = connection;
