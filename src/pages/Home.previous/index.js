import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/core/Button';
import JamMobileView from '../../resources/images/jam-mobileview.png';
import JamWebView from '../../resources/images/jam-webview.png';
import styles from './styles.module.scss';

function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.introduction}>
        <div className={styles.left}>
          <div>Spontaneous,</div>
          <div>permissionless calling</div>
        </div>
        <div className={styles.right}>
          <span>
            Sometimes a quick chat is all you need to get things done. Jam is simple click-to-talk, audio-first software – without the endless fuss of Zoom links and Meet invites. Pop by someone’s desk even if they’re thousands of miles away.  
          </span>
          <div className={styles.more}>
              <Button className={styles.tryForFree}><Link to="/login">Try for free</Link></Button>
              {/* <button className={styles.downloadApp}>Download app</button> */}
          </div>
        </div>
      </div>
      <div className={styles.photos}>
        <div className={styles.webview}>
          <div className={styles.browserBar}>
            <div className={styles.leftBrowserBar}>
              <div className={styles.circleContainer}><div className={styles.circle}></div></div>
              <div className={styles.circleContainer}><div className={styles.circle}></div></div>
              <div className={styles.circleContainer}><div className={styles.circle}></div></div>
            </div>
          </div>
          <img className={styles.content} src={JamWebView} />
        </div>
        <div className={styles.mobileview}>
          <img src={JamMobileView} />
        </div>
      </div>
    </div>
  )
}

export default LandingPage;