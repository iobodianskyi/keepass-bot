
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

  const addUserSet = async (userId, key, data) => {
    const newSet = {};
    newSet[key] = { key, data };

    return await firestore.collection(userId + '')
      .doc('sets')
      .set(newSet, { merge: true });
  }

  const findByKey = async (userId, key) => {
    const docRef = await firestore.collection(userId + '')
      .doc('sets').get();

    const sets = docRef.data();

    if (!sets) return null;

    const found = [];

    const keyLowerCase = key.toLowerCase();
    for (const keyItem of Object.keys(sets)) {
      if (keyItem.toLowerCase().includes(keyLowerCase)) {
        found.push(sets[keyItem]);
      }
    }

    return found.length ? found : null;
  }

  db.init = init;
  db.saveUserInfo = saveUserInfo;
  db.getUserLastAction = getUserLastAction;
  db.setLastUserAction = setLastUserAction;
  db.getUserLastActionText = getUserLastActionText;
  db.setLastUserActionText = setLastUserActionText;
  db.addUserSet = addUserSet;
  db.findByKey = findByKey;

  module.exports = db;
})();
