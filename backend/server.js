const app = require('./app');
const http = require('http');
const { connect } = require('./config/database');

const port = process.env.PORT || 4001;

/* npm run dev to run nodemon */

(async () => {
  try {
    // Connect to database
    await connect();
    console.log("Connected to database!");

    // Start server
    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server running on port ${port}`));
  } 
  catch (error) {
    console.error(`Error connecting to the database: ${error}`);
  }
})();