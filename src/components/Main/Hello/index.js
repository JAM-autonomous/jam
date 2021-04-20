import React from 'react';
import styles from './styles.module.scss';
import { getNameFromEmail } from "../../../helper/utils";

function Hello({ auth }) {
  return (
    <div className={styles.container}>
      <div className={styles.hello}>Hello</div>
      <div className={styles.name}>{ getNameFromEmail(auth.email) }</div>
    </div>
  )
}

export default Hello;