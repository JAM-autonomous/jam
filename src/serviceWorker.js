import {  firebaseMessaging } from './services/firebase';
import { logService } from './services/log';
import { requestNotificationPermission } from './services/notification';

const Log = logService.createLog("Service Worker");

export const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        //start
        navigator.serviceWorker.getRegistrations().then(currentRegistrations => {
          Log.info('current registration', currentRegistrations);
          const cacheFirebaseMessagingToken = localStorage.getItem('FIREBASE_MESSAGING_TOKEN');
          Log.info('cacheFirebaseMessagingToken', cacheFirebaseMessagingToken);
          if (cacheFirebaseMessagingToken === null) {
            currentRegistrations.forEach(currentRegistration => 
              currentRegistration.unregister()
              .then(unregisterResult => Log.info('Unregister result', unregisterResult))
              .catch(err => Log.info('Unregister error', err))
            );
    
          }
          if (currentRegistrations.length === 0) {
            // no service worker registration, get token
            firebaseMessaging.getToken().then(token => {
              Log.info('Firebase Messaging - Device Token ', token);
              localStorage.setItem('FIREBASE_MESSAGING_TOKEN', token);
              // firebase will auto register a service worker if no registration is found, do not need to do it manually.
              // registerServiceWorker();
            }).catch(err => {
              Log.info('Firebase Messaging - getToken Error', err);
            });
            
          } else {
            currentRegistrations.forEach(currentRegistration => 
              currentRegistration.update()
              .then(updateRegistrationResult => Log.info('Update Registration result', updateRegistrationResult))
              .catch(err => Log.info('Update Registration error', err))
            );
            
          }
          
        });
        //end
      }
    });
    
    
  }
};

export const registerServiceWorker = () => {
  // register firebase messaging service worker
  navigator.serviceWorker
    .register('firebase-messaging-sw.js')
    .then(function (registration) {
      // eslint-disable-next-line no-console
      Log.info('[SW]: SCOPE: ', registration.scope);
      return registration.scope;
    })
    .catch(function (err) {
      return err;
    });  
}
