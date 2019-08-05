module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('days_work_providers', {
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
      },
      day_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'days', key: 'id' },
      },
      hour_start: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      hour_break: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      hour_restart: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      hour_end: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        date: Sequelize.DATE,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('days_work_providers');
  },
};
