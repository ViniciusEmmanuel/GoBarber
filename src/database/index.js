const Sequelize = require('sequelize');
const Mogoose = require('mongoose');

const User = require('../app/models/User');
const File = require('../app/models/File');
const Appointment = require('../app/models/Appointment');

const databaseConfig = require('../config/database');

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnetion = Mogoose.connect(
      'mongodb://localhost:27017/GoBarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
      }
    );
  }
}

module.exports = new Database();
