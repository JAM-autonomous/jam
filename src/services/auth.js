import { handleClearAuth } from  './handleClearAuth';
import http, { setToken } from "./http";
import { jamLocalStorage } from "./localStorage";
import { Redirect, Route } from "react-router-dom";
import { logService } from './log';
import { Toast } from './toast';
import { aaTrack } from './tracking';
import { STATUS_PARAMS, TRACK_DEFINE } from './tracking/define';

let Log = logService.createLog("AuthService", { logToServer: true });

// TODO should move auth to redux
class AuthService {
  loading = false;
  isAuthenticated = false;
  auth = undefined;
  _onAuthChangeListener = [];

  constructor() {
    const cache = jamLocalStorage.getAuth();
    if (cache) {
      const { email: cacheEmail } = cache;
      if (cacheEmail) {
        this.handleLogin(cache);
      }
    }
  }

  onAuthChange(callback) {
    this._onAuthChangeListener.push(callback);
  }

  triggerAuthChangeCallbacks() {
    this._onAuthChangeListener.forEach(callback => callback(this.auth));
  }

  logout = () => {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    http.post('api/logout')
      .then(isSuccess => {
        if (isSuccess) {
          handleClearAuth();
          this.auth = undefined;
          this.isAuthenticated = false;
          this.triggerAuthChangeCallbacks();
        } else {
          throw new Error('Logout failed');
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  verify = () => {
    if (this.loading === true) {
      return;
    }
    this.loading =  true;
    http.get('api/profile').then(res => {
      this.loading = false;
      this.isAuthenticated = true;
    }).catch(err => {
      this.loading = false;
    })
  }

  handleLogin = (auth, onLoginSuccess) => {
    const { token } = auth;
    this.isAuthenticated = true;
    jamLocalStorage.saveAuth(auth);
    setToken(token);
    onLoginSuccess && onLoginSuccess(auth);
    this.auth = auth;
    this.verify();
    logService.setUserId(auth.id);
    logService.setUserEmail(auth.email);
    aaTrack.setUserId(auth.email);
    
    // update Log
    Log = logService.createLog("AuthService", { logToServer: true });
    this.triggerAuthChangeCallbacks();
  }

  login = (input, onLoginSuccess) => {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    http.post('api/login', {
      email: input.email,
      workspace: input.workspace,
    })
      .then(res => {
        this.loading = false;
        this.handleLogin(res, onLoginSuccess);
        Log.info('login_request');
      })
      .catch(e => {
        this.loading = false;
      });
  }

  requestOtp = (email, onRequestSuccess) => {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    http.post('api/login', {
      email: email
    }).then(res => {
      this.loading = false;
      onRequestSuccess(res);
      Log.info('login_request_otp');
    }).catch(e => {
      this.loading = false;
    });
  }

  verifyOtp = (otp, onVerifySuccess) => {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    http.post('api/complete-login', {
      code: otp
    }).then(res => {
      this.loading = false;
      this.handleLogin(res, onVerifySuccess)
      Log.info('login_complete');
      aaTrack.trackEvent(TRACK_DEFINE.API_LOGIN_OTP_SUCCESS);
    }).catch(e => {
      this.loading = false;
      Toast.error('This code is not valid. Please try again, or request a new one.');
      aaTrack.trackEvent(TRACK_DEFINE.API_LOGIN_OTP_FAIL);
    });
  }

  resendOtp = (email, onResendOtpSuccess) => {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    http.post('api/login', {
      email: email
    }).then(res => {
      this.loading = false;
      onResendOtpSuccess(res);
      Log.info('login_resend_otp');
      Toast.info('New code sent.');
      aaTrack.trackEvent(TRACK_DEFINE.API_RESEND_OTP, [STATUS_PARAMS.SUCCESS]);
    }).catch(e => {
      this.loading = false;
      aaTrack.trackEvent(TRACK_DEFINE.API_RESEND_OTP, [STATUS_PARAMS.FAIL]);
    });
  }


  invite = (emails, onInviteSuccess) => {
    if (this.loading === true) {
      return;
    }
    this.loading = true;
    http.post('api/invite', {
      emailList: emails
    }).then(res => {
      this.loading = false;
      onInviteSuccess(res);
    }).catch(e => {
      this.loading = false;
    });
  }

}

const authService = new AuthService();
export default authService;

export function PrivateRoute({ children, ...rest }) {
  let auth = authService;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated && auth.auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/get-started",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export function PublicRoute({ children, ...rest }) {
  let auth = authService;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !auth.isAuthenticated || !auth.auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
