const { db } = require('../config/database')

const sync = () => {
db.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((error) => {
    console.log('Unable to sync the models:', error);
  })
};

  module.exports = sync;