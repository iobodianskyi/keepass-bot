(() => {
  'use strict';

  const resources = {
    projectId: 'keepass-bot',
    // will be filled from db
    appPort: null,
    urls: {
      projectInfo: 'https://us-central1-dev-obodianskyi.cloudfunctions.net/projectInfo',
      sendMessage: ''
    },
    bot: {
      token: ''
    }
  };

  module.exports = resources;
})();
