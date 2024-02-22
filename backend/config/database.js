const { Pool } = require('pg');


  const pool = new Pool({
    user: process.env.DB_USER || 'ecommerce_app',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'e-commerce-api',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Function to connect to database
const connect = async () => {
  try {
    await pool.connect();
    console.log('Connected to database!');
  } catch (err) {
    throw err;
  }
};

// Function to execute query
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    throw err;
  }
};


// Export the 'connect' and 'query' function to be used in other parts of the application
module.exports = {
  connect,
  query
};