// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive
import { initializeApp } from 'firebase/app'
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging'
import firebaseConfig from '@/constants/firebase-credential'

export const requestForToken = async () => {
  const checkSupported = await isSupported()
  if (checkSupported) {
    initializeApp(firebaseConfig)

    const messaging = getMessaging()
    return getToken(messaging, {
      vapidKey: firebaseConfig?.vapidKey,
    })
      .then((currentToken) => {
        if (currentToken) {
          // Perform any other neccessary action with the token
          console.log(
            'Successfully generated registration token.',
            currentToken
          )
        } else {
          // Show permission request UI
          console.warn(
            'No registration token available. Request permission to generate one.'
          )
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token.', err)
      })
  }
  console.info('FCM is not supported in this browser.')
  return null
}

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = async () => {
  const checkSupported = await isSupported()
  if (checkSupported) {
    return new Promise((resolve) => {
      const messaging = getMessaging()
      onMessage(messaging, (payload) => {
        resolve(payload)
      })
    })
  }
  return null
}
