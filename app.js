const config = require('./config/env/environment')();
const http = require('http');
const app = require('./config/express')();
require('./config/database')(config.db);

app.listen(config.port, () => {
  console.log(`Server ${config.address} (${config.env}) listening in port ${config.port}`);
});

module.exports = app;