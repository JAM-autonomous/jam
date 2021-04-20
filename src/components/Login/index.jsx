import React, { useEffect } from 'react';
import Otp from './Otp';
import authService from '../../services/auth';
import styles from './styles.module.scss';
import { emailValidator } from '../../helper/validator';
import { useHistory } from 'react-router-dom';
import { Input } from '../core/Input';
import { ErrorMessage } from '../ErrorMessage';
import { Button } from '../core/Button';
import { logService } from '../../services/log';
import { aaTrack } from '../../services/tracking';
import { ACTION_PARAMS, TRACK_DEFINE } from '../../services/tracking/define';

const Log = logService.createLog("Login");

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [validationMessage, setValidationMessage] = React.useState("")
  const [otpView, setOtpView] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [enableResend, setResendStatus] = React.useState(false);
  const history = useHistory();

  const afterLogin = (res) => {
    Log.info('Login result received', res);

    setTimeout(() => {
      history.push("/");
    }, 200);
  }

  function onKeyUp(e) {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      // track if enter
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_CONTINUE_LOGIN, [ACTION_PARAMS.PRESS_ENTER]);

      handleRequestOtp();
    }
  }

  const onEmailChange = (changed) => {
    setEmail(String(changed || '').toLowerCase());
    setValidationMessage("")
  }

  const noEmail = () => {
    return email === '';
  }

  const invalidEmail = () => {
    if (noEmail()) {
      return false;
    }
    return !emailValidator(email);
  }

  const invalidForm = () => {
    return noEmail() || invalidEmail();
  }

  const validForm = () => {
    return !noEmail() && !invalidEmail();
  }

  const onRequestOtpSuccess = (res) => {
    Log.info('on request otp success. Result: ', res);
    if (res === true) {
      setOtpView(true);
    }
  }

  const validate = () => {
    if(noEmail()) {
      setValidationMessage("Please enter your work email.")
      return false
    }

    if(invalidEmail()){
      setValidationMessage("Please enter a valid email address.")
      return false
    }

    return true
  }

  const handleRequestOtp = () => {
    if(!validate()) return

    authService.requestOtp(email, onRequestOtpSuccess);
  }
  const onResendOtpSuccess = (res) => {
    Log.info('on resend otp success', res);
  }

  const handleResendOtp = () => {
    setResendStatus(false);
    authService.resendOtp(email, onResendOtpSuccess);
  }

  const handleVerifyOtp = (newCode) => {
    Log.info("request login with new code. " + newCode)
    authService.verifyOtp(otp, afterLogin);
  }

  const checkEmail = () => {
    if (invalidEmail()) return 'Please enter a valid email address';
    if (noEmail()) return 'Enter your work email';
  }

  return (
    <div className={styles.container}>
      { otpView ?
        <Otp
          email={email}
          otp={otp}
          setOtp={setOtp}
          enableResend={enableResend}
          setResendStatus={setResendStatus}
          onClickResend={handleResendOtp}
          onLogin={handleVerifyOtp} /> :
        <div className={styles.form}>
          <h3 className={styles.loginTitle}>Welcome to JAM</h3>

          <div className={styles.inputContainer}>
            <Input
              className={styles.input}
              type="text"
              placeholder="Enter your work email"
              maxLength={100}
              value={email}
              onTextChange={onEmailChange}
              onKeyUp={onKeyUp}
              onFocus={() => aaTrack.trackEvent(TRACK_DEFINE.TYPE_INPUT_EMAIL)}
            />

            {
              !!validationMessage.length
              &&
              <ErrorMessage text={validationMessage} />
            }
          </div>
          {/* <input type="text" placeholder="Workspace" value={workspace} onChange={e => setWorkspace(e.target.value)} /> */}
          
          <Button
              className={styles.submitButton}
              onClick={() => {
                aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_CONTINUE_LOGIN);
                handleRequestOtp();
              }}>
                Continue
          </Button>
        </div>
      }
    </div>
  )
}
