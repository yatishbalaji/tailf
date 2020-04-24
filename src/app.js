const express = require('express');
const http = require('http');
const path = require('path');

const config = require('./config/environment');
const logger = require('./components/logger');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const filePath = '/home/samir/yatish/projects/tailf/logs/error.2020-04-18.log';

require('./api/tailf')(io, filePath);

function startServer() {
  server.listen(config.port, config.ip, () => {
    logger.debug(`New Server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

startServer();

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', err);
});

app.use(express.static(path.join(__dirname, '../', 'public')));

// Expose app
module.exports = app;
