
(() => {
  'use strict';

  const firebase = require('firebase-admin');

  const serviceAccount = require('../keepass-bot-firebase.json');
  const resources = require('./resources');

  const db = {};
  let firestore;

  const init = () => {
    firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount) });
    firestore = firebase.firestore();
  }

  const saveUserInfo = (user) => {
    firestore.collection(user.id + '')
      .doc('info')
      .set(user, { merge: true });
  }

  db.init = init;
  db.saveUserInfo = saveUserInfo;

  module.exports = db;
})();
