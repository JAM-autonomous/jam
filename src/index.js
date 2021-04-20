import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CONFIG from './config/config';
import reportWebVitals from './reportWebVitals';
// import { initServiceWorker } from './serviceWorker';
import { logService } from './services/log';
import { aaTrack } from './services/tracking';

const Log = logService.createLog("Index file");

Log.info('App is runing on mode:', CONFIG.IS_PRODUCTION ? 'production 123' : 'development');
Log.info('App version:', CONFIG.VERSION);

// setup for tracking, MUST RUN ON APP LOAD
aaTrack.setup();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(Log.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// initServiceWorker();
