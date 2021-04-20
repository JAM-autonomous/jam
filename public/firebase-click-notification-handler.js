self.addEventListener('notificationclick', event => {
  console.log('notificationclick', event)
  const url = event.currentTarget.location.origin;
  const action = event.action;
  event.notification.close(); // Android needs explicit close.
  switch(event.action){
    case 'open_url':
    console.log('Action ' + action, url);
    // clients.openWindow(event.notification.data.url); //which we got from above
    clients.openWindow(url); //which we got from above
    break;
    default:
        console.log('Action - Default ', action);
        event.waitUntil(
            clients.matchAll({includeUncontrolled: true, type: 'window'}).then( windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // If so, just focus it.
                    if (client.url.includes(url) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, then open the target URL in a new window/tab.
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    break;
  }
  
  return event;
});