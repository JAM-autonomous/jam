import React from 'react';
import styles from './styles.module.scss';
import { cx } from '../../../helper/utils';

export const Textarea = ({ onTextChange, className, ...otherProps }) => {

  return (
    <textarea
      maxLength={1000}
      {...otherProps}
      className={cx(styles.container, className)}
      onChange={e => onTextChange(e.target.value)}
    />
  );
};