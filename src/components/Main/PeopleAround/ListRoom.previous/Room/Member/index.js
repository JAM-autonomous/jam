import React, { useState } from 'react';
import { logService } from '../../../../../../services/log';
import styles from './styles.module.scss';

const Log = logService.createLog("Member");

function Member({ user, index, userDisplayLimit }) {
  const { email } = user;
  const name = email.split("@")[0];
  if (index > userDisplayLimit - 1) {
    Log.info(index)
    return null;
  }
  return (
    <div className={styles.container}>
      <span className={styles.name}>{ name } </span>
      <span className={styles.statusContainer}>
        {/* <Status status={status} room={room} user={user} auth={auth} /> */}
      </span>
    </div>
  )
}

export default Member;