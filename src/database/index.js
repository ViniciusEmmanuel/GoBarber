const Sequelize = require('sequelize');

const Users = require('../app/models/User');

const databaseConfig = require('../config/database');

const models = [Users];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

module.exports = new Database();
