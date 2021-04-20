// importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-messaging.js');
importScripts('./firebase-prevent-default-notification.js');
importScripts('./firebase-click-notification-handler.js');

const config = {
    apiKey: "AIzaSyAsYPb7cxQSnQNjI7x4CTg-UbzxRQdE-Bg",
    authDomain: "pjam-293710.firebaseapp.com",
    databaseURL: "https://pjam-293710.firebaseio.com",
    projectId: "pjam-293710",
    storageBucket: "pjam-293710.appspot.com",
    messagingSenderId: "1098600099639",
    appId: "1:1098600099639:web:c0a3da15b6a1e9d7c234b2",
    measurementId: "G-RLBT5ZMKWZ"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(e => {
  console.log('on background message', e);
  const { body, image, title } = e.data;
  self.registration.showNotification(title, {
    body,
    icon: image,
    actions: [{action: "open_url", title: "JAM Now"}],
  });
});

console.warn('Firebase messaging service worker added.');
