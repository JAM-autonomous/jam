import React from 'react';
import authService from '../../services/auth';
import { aaTrack } from '../../services/tracking';
import { TRACK_DEFINE } from '../../services/tracking/define';
import { Button } from '../core/Button';
import AddEmail from './AddEmail';
import styles from './styles.module.scss';

function Invite({ onSuccess }) {
  const [emails, setEmails] = React.useState([]);
  const onInviteSuccess = (res) => {
    if (res === true) {
      setEmails([]);

      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    }
  }
  const handleInvite = () => {
    if (emails.length > 0) {
      authService.invite(emails, onInviteSuccess)
    }
  }
  const invalidEmailList = () => {
    return emails.length === 0;
  }
  
  return (
    <div className={styles.container}>
      <span className={styles.desc}>Press enter after each address to invite multiple people.</span>
      <AddEmail emails={emails} setEmails={setEmails} />
      <Button disabled={invalidEmailList()} onClickAsync={() => {
        aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_INVITE_SEND);
        return handleInvite();
      }}>Send invitation</Button>
    </div>
  )
}

export default Invite;
