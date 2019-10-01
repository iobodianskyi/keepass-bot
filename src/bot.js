(() => {
  'use strict';

  const telegraf = require('telegraf');
  const Telegram = require('telegraf/telegram');
  const Markup = require('telegraf/markup')
  const Extra = require('telegraf/extra');

  const resources = require('./resources');
  const db = require('./db');

  const actions = {
    addKey: 'add-key',
    addInfo: 'add-info',
    find: 'find'
  };

  const startKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('🔒 New', actions.addKey),
    Markup.callbackButton('🔍 Find', actions.find)
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

    // todo: move to resources
    const messages = {
      welcome: '`🤗 Welcome to keepass bot!`',
      pong: '`🏓 pong`',
      enterKey: '`Enter key:`',
      enterInfo: '`Enter info:`',
      whatsFind: '`What\'s find:`',
      added: '`Added! What\'s next:`',
      error: '`Ooops! an error occured: `'
    };

    telegramBot.catch((err) => {
      // todo: send to info-bot
      console.log(messages.error, err);
    });

    telegramBot.start(ctx => {
      const user = ctx.from;
      db.saveUserInfo(user);

      ctx.deleteMessage();
      ctx.replyWithMarkdown(messages.welcome, Extra.markup(startKeyboard));
    });

    // commands
    telegramBot.command(commands.ping, ({ replyWithMarkdown }) => replyWithMarkdown(messages.pong));

    // actions
    telegramBot.action(actions.addKey, async ctx => {
      // store action
      db.setLastUserAction(ctx.from.id, actions.addKey);
      return ctx.replyWithMarkdown(messages.enterKey);
    });

    telegramBot.action(actions.find, async ctx => {
      // store action
      db.setLastUserAction(ctx.from.id, actions.find);

      return ctx.replyWithMarkdown(messages.whatsFind);
    });

    telegramBot.on('message', async (ctx) => {
      const userId = ctx.from.id;
      const message = ctx.update.message.text;
      const lastUserAction = await db.getUserLastAction(userId);

      switch (lastUserAction) {
        case actions.addKey: {
          db.setLastUserActionText(userId, message);
          db.setLastUserAction(ctx.from.id, actions.addInfo);

          return ctx.replyWithMarkdown(messages.enterInfo);
        }
        case actions.addInfo: {
          const key = await db.getUserLastActionText(userId);

          if (key) {
            await db.addUserSet(userId, key, message);

            db.setLastUserAction(userId, '');
            db.setLastUserActionText(userId, '');
            ctx.deleteMessage();

            return ctx.replyWithMarkdown(messages.added, Extra.markup(startKeyboard));
          } else {
            // todo: define what to do
          }

          break;
        }
        case actions.find: {
          console.log(actions.find);
          break;
        }
        default: {
          // todo: define what to do
          console.log('no actions');

          db.setLastUserActionText(userId, message);

          break;
        }
      }
    });

    telegramBot.startPolling();
  }

  bot.start = start;

  module.exports = bot;
})();
