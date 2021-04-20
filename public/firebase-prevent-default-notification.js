console.log('firebase-prevent-default-notification');
class CustomPushEvent extends Event {
  constructor(data) {
      super('push')

      Object.assign(this, data)
      this.custom = true
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  let oldData = e.data

  // Create a new event to dispatch, pull values from notification key and put it in data key, 
  // and then remove notification key
  let newEvent = new CustomPushEvent({
      data: {
          json() {
              let newData = oldData.json()
              newData.data = {
                  ...newData.data,
                  ...newData.notification
              }
              delete newData.notification
              return newData
          },
      },
      waitUntil: e.waitUntil.bind(e),
  })

  // Stop event propagation
  e.stopImmediatePropagation()

  // Dispatch the new wrapped event
  dispatchEvent(newEvent)
});