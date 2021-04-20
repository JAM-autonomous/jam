import firebase from 'firebase/app';
import 'firebase/messaging';
import config from '../../config/config';

const firebaseConfig = config.FIREBASE_CONFIG;

firebase.initializeApp(firebaseConfig);
export const firebaseMessaging = {};
