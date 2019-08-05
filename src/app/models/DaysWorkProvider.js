const { Model } = require('sequelize');
const Sequelize = require('sequelize');

class DaysWorkProvider extends Model {
  static init(sequelize) {
    super.init(
      {
        provider_id: Sequelize.INTEGER,
        day_id: Sequelize.INTEGER,
        hour_start: Sequelize.TIME,
        hour_break: Sequelize.TIME,
        hour_restart: Sequelize.TIME,
        hour_end: Sequelize.TIME,
        status: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    this.removeAttribute('id');
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Days, { foreignKey: 'day_id', as: 'day' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

module.exports = DaysWorkProvider;
