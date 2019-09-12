(() => {
  'use strict';

  const telegraf = require('telegraf');
  const Telegram = require('telegraf/telegram');
  const Markup = require('telegraf/markup')
  const Extra = require('telegraf/extra');

  const resources = require('./resources');
  const db = require('./db');

  const addKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('🔒 New', 'add-info')
  ]);

  const bot = {};

  let telegram;

  const start = () => {
    let telegramBot = new telegraf(resources.bot.token);
    telegram = new Telegram(resources.bot.token);

    // for BotFather commands setup
    // ping - Is online...
    const commands = {
      // todo: restrict only for admin
      ping: 'ping'
    };

    const actions = {
      addInfo: 'add-info'
    };

    // todo: move to resources
    const messages = {
      welcome: '`🤗 Welcome to keepass bot!`',
      ping: '`🏓 pong`',
      enterInfo: '`Enter info:`',
      error: '`Ooops! an error occured: `'
    };

    telegramBot.catch((err) => {
      // todo: send to info-bot
      console.log(messages.error, err);
    });

    telegramBot.start(ctx => {
      const user = ctx.from;
      db.saveUserInfo(user);

      ctx.replyWithMarkdown(messages.welcome, Extra.markup(addKeyboard));
    });

    telegramBot.on('message', ({ replyWithMarkdown }) => replyWithMarkdown(ctx.update.message.text));

    // commands
    telegramBot.command(commands.ping, ({ replyWithMarkdown }) => replyWithMarkdown(messages.ping));

    // actions
    telegramBot.action(actions.addInfo, async ctx => {
      const message = await ctx.replyWithMarkdown(messages.enterInfo);
    });

    telegramBot.startPolling();
  }

  bot.start = start;

  module.exports = bot;
})();
