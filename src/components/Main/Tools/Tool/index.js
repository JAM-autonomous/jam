import React from 'react';
import { cx } from '../../../../helper/utils';
import styles from './styles.module.scss';

function Tool({ children, imageSrc, containerClassname, imageContainerClassName = styles.imgContainer, disabled, onClick, childrenComponent }) {
  return (
    <div className={cx(styles.container, disabled && styles.disabled, containerClassname)} onClick={onClick}>
        {
          childrenComponent || (
            <>
              <div className={imageContainerClassName}>
                <img src={imageSrc} />
              </div>
              <div className={styles.iconDescription}>
                { children }
              </div>
            </>
          )
        }
      </div>
  )
}

export default Tool;