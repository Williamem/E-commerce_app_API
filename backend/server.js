const app = require('./app');
const http = require('http');
const { db } = require('./config/database');

const port = process.env.PORT || 5000;

// Connect to database
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");

  // Start server
  const server = http.createServer(app);
  server.listen(port, () => console.log(`Server running on port ${port}`));
});