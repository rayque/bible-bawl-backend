require('dotenv').config();

module.exports = {
  username: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME,
  host: process.env.APP_DB_HOST,
  dialect: 'mysql',
  define: {
    timestamps: true,
    underscored: true,
  },
};
