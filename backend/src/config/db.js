const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'maxlence_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'rootpassword',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connected Successfully...');
  } catch (error) {
    console.error('Unable to connect to MySQL database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
