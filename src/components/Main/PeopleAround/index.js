import React from 'react';
// import ListRoom from './ListRoom';
import styles from './styles.module.scss';
import { cx } from '../../../helper/utils';

//components
import SearchFriend from '../Tools/SearchFriend';
import RoomList from "./RoomList"

function PeopleAround({listRoom, auth, agoraClient, keyword, messageQueueManager, onSearchKeyword, showMessage}) {
  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
          <span className={cx(styles.left, styles.title)}>Your team</span>
          <div className={styles.right}>
            <SearchFriend setKeyword={onSearchKeyword} keyword={keyword} containerClassname={styles.searchBox} />
          </div>
      </div>

      <RoomList
        listRoom={listRoom}
        auth={auth}
        agoraClient={agoraClient}
        keyword={keyword}
        messageQueueManager={messageQueueManager}
        showMessage={showMessage}
      />

      {/*<ListRoom listRoom={listRoom} auth={auth} agoraClient={agoraClient} keyword={keyword} messageQueueManager={messageQueueManager} showMessage={showMessage}/>*/}
    </div>
  )
}

export default PeopleAround;