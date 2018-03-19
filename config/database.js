const mongoose = require('mongoose');
const config = require('./env/environment')();

mongoose.Promise = global.Promise;

module.exports = uri => {
  mongoose.connect(uri, {useMongoClient: true});

  mongoose.connection.on('connected', () => {
    if(config.debug) console.log(`Mongoose connected in: ${uri}`);
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose error in connection: ${uri}`);
  });

  mongoose.connection.on('disconnected', () => {
    if(config.debug) console.log(`Mongoose disconnected from ${uri}`);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      if(config.debug) console.log('Disconnected by application term');
      process.exit(0);
    });
  });
  
}