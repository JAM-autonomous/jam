export default {
  VERSION: "0.2.2",
  PEER_JS_SERVER: {
    host: "peerjs-server-4zqef7rt7q-as.a.run.app",
    port: 80
  },
  BACKEND_SERVER: '',
  SOCKET_SERVER: 'wss://sjam-dev.autonomous.ai',
  SOCKET_SERVER_PATH: '/api/socket.io',
  IS_PRODUCTION: false,
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
    AppId: "9933b46c48f445089bed30d3630955bc",
  },
  GA_CONFIG: {
    trackingId: ""
  },
  AA_CONFIG: {
    API_KEY: 'xuvnivWnv1hzsc4zK6dBatCBGBI1nQ-g',
  }
}