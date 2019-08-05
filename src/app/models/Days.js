const { Model } = require('sequelize');
const Sequelize = require('sequelize');

class Days extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

module.exports = Days;
