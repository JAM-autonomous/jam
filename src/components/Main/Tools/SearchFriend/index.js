import React from 'react';
import searchIcon from '../../../../resources/images/search-ic.svg';
import styles from './styles.module.scss';
import { Input } from '../../../core/Input';
import { cx } from '../../../../helper/utils';

function SearchFriend({ keyword, setKeyword, containerClassname }) {

  return  (
    <div className={cx(styles.container, containerClassname)}>
      <Input
        containerClassname={styles.input}
        value={keyword}
        onTextChange={setKeyword}
        placeholder="Search members"
        appendComponent={(
          <div className={styles.append}>
            <img src={searchIcon} />
          </div>
        )}
      />
    </div>
  )
}

export default SearchFriend;