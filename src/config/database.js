module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5400',
  username: 'postgres',
  password: 'admin',
  database: 'GoBarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
