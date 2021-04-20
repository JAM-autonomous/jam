import React from 'react';
import { cx } from '../../../../helper/utils';
import { showInviteModal } from '../../../Invite/InviteModal';
import styles from './styles.module.scss';

function InviteFriend({ containerClassname }) {
  return  (
    <div className={cx(styles.container, containerClassname)} onClick={showInviteModal}>Invite</div>
  )
}

export default InviteFriend;