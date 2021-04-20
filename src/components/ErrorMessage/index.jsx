import React from 'react';
import styles from './styles.module.scss';

export const ErrorMessage = ({ text }) => (
  <div className={styles.container}>
    <span className={styles.text}>{text}</span>
  </div>
);