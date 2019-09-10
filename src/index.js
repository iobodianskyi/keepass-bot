(async () => {
  'use strict';

  const http = require('http');
  const express = require('express');
  const server = express();
  const request = require('request');

  const resources = require('./resources');
  const bot = require('./bot');

  const startServer = () => {
    const httpServer = http.createServer(server);
    httpServer.listen(resources.appPort);
    consoleLogger.info(`Server started on ${httpServer.address().port}`);

    // start bot
    bot.start();
  }

  // get app info
  request(resources.urls.projectInfo, { qs: { id: resources.projectId }, json: true }, (error, responce, body) => {
    resources.appPort = body.port;
    resources.urls.sendMessage = body.urls.sendMessage;
    resources.bot.token = body.telegram.keepassBotToken;

    // start server
    startServer();
  });
})();
