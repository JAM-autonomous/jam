import React from 'react';
import Tool from '../Tool';
import InviteIcon from '../../../../resources/images/icon_invite_friend.png';
import { showInviteModal } from '../../../Invite/InviteModal';
import styles from './styles.module.scss';
import { cx } from '../../../../helper/utils';
import { aaTrack } from '../../../../services/tracking';
import { TRACK_DEFINE } from '../../../../services/tracking/define';

function InviteFriendTool({ className }) {
  return  (
    <div className={cx(styles.container, className)} onClick={() => {
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_INVITE_FROM_LISTROOM);
      showInviteModal();
    }}>
      <Tool containerClassname={styles.tool} imageSrc={InviteIcon} imageContainerClassName={styles.imgContainerOn}>
        <span className={styles.micro}>Invite friend</span>
      </Tool>
    </div>
  )
}

export default InviteFriendTool;