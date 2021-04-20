import React from 'react';
import { cx } from '../../../helper/utils';
import styles from './styles.module.scss';
import closeIcon from '../../../resources/images/icon_close_round.png';

export const Modal = ({ children, title = '', show = false, onClose, closeOnClickBackdrop = false }) => {
  if (show) {
    return (
      <div className={styles.container}>
        <div className={styles.backdrop} {... closeOnClickBackdrop && onClose ? { onClick: onClose} : {} } />
        <div className={styles.modal}>
          <div className={styles.headerContainer}>
            { onClose && <img className={styles.closeBtn} src={closeIcon} onClick={onClose} /> }
            <span className={styles.title}>{title}</span>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    );
  }

  return null;
};
