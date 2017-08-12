// @flow
const firebase = require('firebase');
const credentials = require('./credentials/client');

const init = () => {
  if (firebase.apps.length === 0) {
    return firebase.initializeApp(credentials);
  }
};

export default init();

export const database = firebase.database();
export const auth = firebase.auth();
// eslint-disable-next-line new-cap
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
