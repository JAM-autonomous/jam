export default {
  VERSION: "0.3.3",
  PEER_JS_SERVER: {
    host: "peerjs-server-4zqef7rt7q-as.a.run.app",
    port: 80
  },
  BACKEND_SERVER: '',
  SOCKET_SERVER: 'wss://jam.autonomous.ai',
  SOCKET_SERVER_PATH: '/api/socket.io',
  IS_PRODUCTION: true,
  iceServers: [
    {
      urls: 'turn:34.123.205.86:1609?transport=udp',
      username: 'Ty1',
      credential: 'password'
    },
    {
      urls: 'stun:34.123.205.86:1609',
    },
  ],
  STATUS: {
    DISCONNECTED: "disconnected",
    FAILED: "failed",
    CONNECTED: "connected",
    CLOSED: "closed"
  },
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyAsYPb7cxQSnQNjI7x4CTg-UbzxRQdE-Bg",
    authDomain: "pjam-293710.firebaseapp.com",
    databaseURL: "https://pjam-293710.firebaseio.com",
    projectId: "pjam-293710",
    storageBucket: "pjam-293710.appspot.com",
    messagingSenderId: "1098600099639",
    appId: "1:1098600099639:web:c0a3da15b6a1e9d7c234b2",
    measurementId: "G-RLBT5ZMKWZ"
  },
  AGORA_CONFIG: {
    AppId: "0f5df6f6a3a34bfcb830ace46b55c9a8",
  },
  GA_CONFIG: {
    trackingId: "G-H7HP1C81Y5"
  },
  AA_CONFIG: {
    API_KEY: 'YCf3pMW4dFw4_Nl76q94JF8F5sqlNJUO',
  }
}