
(() => {
  'use strict';

  const firebase = require('firebase-admin');

  const serviceAccount = require('../keepass-bot-firebase.json');

  const db = {};
  let firestore;

  const init = () => {
    firebase.initializeApp({ credential: firebase.credential.cert(serviceAccount) });
    firestore = firebase.firestore();
  }

  const getUserLastAction = async (userId) => {
    const docRef = await firestore.collection(userId + '')
      .doc('actions').get();

    const docData = docRef.data();

    return docData ? docData.last : '';
  }

  const setLastUserAction = async (userId, action) => {
    await firestore.collection(userId + '')
      .doc('actions')
      .set({ last: action }, { merge: true });
  }

  const getUserLastActionText = async (userId) => {
    const docRef = await firestore.collection(userId + '')
      .doc('actions').get();

    const docData = docRef.data();

    return docData ? docData.lastText : '';
  }

  const setLastUserActionText = async (userId, actionText) => {
    await firestore.collection(userId + '')
      .doc('actions')
      .set({ lastText: actionText }, { merge: true });
  }

  const saveUserInfo = (user) => {
    firestore.collection(user.id + '')
      .doc('info')
      .set(user, { merge: true });
  }

  const addUserSet = async (userId, key, text) => {
    const newSet = {};
    newSet[key] = { key, text };

    return await firestore.collection(userId + '')
      .doc('sets')
      .set(newSet, { merge: true });
  }

  db.init = init;
  db.saveUserInfo = saveUserInfo;
  db.getUserLastAction = getUserLastAction;
  db.setLastUserAction = setLastUserAction;
  db.getUserLastActionText = getUserLastActionText;
  db.setLastUserActionText = setLastUserActionText;
  db.addUserSet = addUserSet;

  module.exports = db;
})();
