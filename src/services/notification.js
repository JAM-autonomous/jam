
// import { firebaseMessaging } from './firebase';
import { logService } from './log';

const Log = logService.createLog("Notification");

export const requestNotificationPermission = () => {
  return Notification.requestPermission().then(permission => {
    Log.info('Notification Permission ', permission);
    return permission;
  }).catch(err => {
    Log.info('Notifiction Permission Error ', err);
  });
}

export const showNotification = (title, message) => {
  const noti = new Notification(title, {
    body: message,
  });

  if (noti) {
    noti.onclick = () => {
      window.focus();
      noti.close();
    };
  }
}

// export let onForegroundMessage = null;
// firebaseMessaging.onMessage((payload) => {
//   Log.info('foreground message ', payload);
//   onForegroundMessage !== null && onForegroundMessage(payload);
// });