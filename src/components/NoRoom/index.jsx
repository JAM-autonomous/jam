import React from 'react';
import { showInviteModal  } from '../Invite/InviteModal';
import styles from './styles.module.scss';
import { cx } from '../../helper/utils';
import { aaTrack } from '../../services/tracking';
import { TRACK_DEFINE } from '../../services/tracking/define';

export const NoRoom = ({ className, text = 'There isn’t anyone else here at the moment.', inviteText }) => {
  const handleInvite = () => {
    showInviteModal();
  }
  return (
    <div className={cx(styles.container, className)}>
      <span className={styles.desc}>
        {text}
        <span className={styles.inviteLink} onClick={() => {
          aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_INVITE_FROM_EMPTY_LISTROOM, [{ key: 'custom_explain_text', value: text }]);
          handleInvite();
        }}>{inviteText}</span>
      </span>
    </div>
  );
}