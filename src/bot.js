(() => {
  'use strict';

  const telegraf = require('telegraf');
  const Telegram = require('telegraf/telegram');

  const resources = require('./resources');
  const db = require('./db');

  const bot = {};

  const start = () => {
    let telegramBot = new telegraf(resources.bot.token);
    let telegram = new Telegram(resources.bot.token);

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

    telegramBot.start(async (ctx) => {
      const user = ctx.from;
      db.saveUserInfo(user);

      return ctx.reply(messages.welcome);
    });

    // commands
    telegramBot.command(commands.ping, ({ reply }) => reply(messages.ping));

    telegramBot.startPolling();
  }

  bot.start = start;

  module.exports = bot;
})();
