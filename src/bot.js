(() => {
  'use strict';

  const telegraf = require('telegraf');

  const resources = require('./resources');

  const bot = {};

  const start = () => {
    let telegramBot = new telegraf(resources.bot.token);

    const commands = {
      // todo: restrict only for admin
      ping: 'ping'
    };

    // for BotFather commands setup
    // ping - Is online...

    // todo: move to resources
    const messages = {
      welcome: '🤗 Welcome to keepass bot!',
      ping: '🏓 pong'
    };

    telegramBot.catch((err) => {
      // todo: send to info-bot
      console.log('Ooops! an error occured: ', err)
    })

    telegramBot.start((ctx) => {
      return ctx.reply(messages.welcome);
    });

    // commands
    telegramBot.command(commands.ping, ({ reply }) => reply(messages.ping));

    telegramBot.startPolling();
  }

  bot.start = start;

  module.exports = bot;
})();
