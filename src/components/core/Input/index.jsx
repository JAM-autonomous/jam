import React from 'react';
import styles from './styles.module.scss';
import { cx } from '../../../helper/utils';

export const Input = ({ onTextChange, containerClassname, inputClassname, appendComponent, ...otherProps }) => {

  return (
    <div className={cx(styles.container, containerClassname)}>
      <input
        {...otherProps}
        className={cx(styles.input, inputClassname)}
        onChange={e => onTextChange(e.target.value)}
        spellCheck={false}
      />

      {appendComponent && <div className={styles.append}>{appendComponent}</div>}
    </div>
  );
};