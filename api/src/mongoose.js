const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function (app) {
  mongoose.connect(
    process.env.MONGO_URL,
    { useCreateIndex: true, useNewUrlParser: true }
  );
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
