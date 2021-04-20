import React from 'react';
import OtpInput from 'react-otp-input';
import { Button } from '../../core/Button';
import TikTok from '../TikTok';
import styles from './styles.module.scss';
import { logService } from '../../../services/log';
import { aaTrack } from '../../../services/tracking';
import { TRACK_DEFINE } from '../../../services/tracking/define';

const Log = logService.createLog("OTP");

function Otp({ email, otp, setOtp, enableResend, setResendStatus, onClickResend, onLogin }) {
  const limitNumber = 6;
  const valid = () => {
    return otp.length === 6;
  }
  const onOtpChange = (e) => {
    setOtp(e);
  }
  const onClickLogin = () => {
    if (otp.length === limitNumber) {
      Log.info('send otp to login', otp);
      onLogin(otp);
    }
  }
  return (
    <div className={styles.container}>
        <p className={styles.annouce}>Enter the Jam code sent to your email inbox.</p>
        <OtpInput
          containerStyle={styles.otpInput}
          inputStyle={styles.inputCell}
          isInputNum={true}
          shouldAutoFocus={true}
          value={otp}
          onChange={onOtpChange}
          numInputs={limitNumber}
          separator={<span></span>}
        />
        <div className={styles.resendContainer}>
          Didn’t get the code?
          { enableResend
            ? <span className={styles.resendBtn} onClick={() => {
              aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_RESEND_CODE);
              onClickResend();
            }}>Resend</span>
            : <span className={styles.resendCountdown}>Resend in <TikTok timeoutSecond={30} onTimeout={() => setResendStatus(true)} /></span>
          }
        </div>
        <Button className={`button submit ${!valid() ? 'disabled' : ''}`} type="submit" onClick={() => {
          aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_LOGIN);
          onClickLogin();
        }}>Login</Button>
      </div>
  )
}

export default Otp;