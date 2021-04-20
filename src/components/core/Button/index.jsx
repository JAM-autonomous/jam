import React from 'react';
import { debounce } from 'debounce';
import { cx } from '../../../helper/utils';
import { LoadingIcon } from '../LoadingIcon';
import styles from './styles.module.scss';

export const Button = ({ children, className, onClickAsync, onClick, ...otherProps }) => {
  const [loading, setLoading] = React.useState(false);
  const AVOID_FLASH_TIMEOUT_MS = 800;
  const ref = React.useRef(null)

  React.useEffect(() => {
    return () => {
      console.log("Button unmouted")
    }
  }, [])

  const handleClick = debounce(() => {
    // show loading status if onClickAsync has been passed
    if (typeof onClickAsync === 'function') {
      const promise = onClickAsync();

      if (promise instanceof Promise) {
        // start loading
        setLoading(true);

        // some time loading is too fast, use this method to avoid it (flash UI)
        const loadingDelay = () => new Promise(r => {
          setTimeout(() => r(), AVOID_FLASH_TIMEOUT_MS);
        });

        Promise.all([loadingDelay(), promise]).finally(() => {
          if(ref.current)
            setLoading(false);
        });
      }

      return;
    }

    // normal button
    if (typeof onClick === 'function') {
      onClick();
    }
  }, 200);

  return (
    <button
      className={cx(styles.container, className)}
      onClick={handleClick}
      {...otherProps}
      ref={ref}
    >
      {loading ? <LoadingIcon /> : children}
    </button>
  );
}