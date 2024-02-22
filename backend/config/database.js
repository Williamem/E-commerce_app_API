const Sequelize = require('sequelize');

// Setting up a new Sequelize instance
const db = new Sequelize(
    process.env.DB_NAME || 'e-commerce-api',
    process.env.DB_USER || 'ecommerce_app',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

// Function to connect to the database
const connect = async () => {
  try {
    await db.authenticate();    // Sequelize's equivalent of "pool.connect()" in pg
    console.log('Connected to database!');
  }
  catch (err) {
    throw err;
  }
};

// Exporting 'connect' and db (Sequelize instance) to be used in other parts of the application
module.exports = {
    db,
    connect
};