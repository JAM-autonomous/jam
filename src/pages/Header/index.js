import React from 'react';
import { showFeedbackModal } from '../../components/SendFeedback/FeedbackModal';
import { useHistory } from 'react-router';
import authService from '../../services/auth';
import styles from './styles.module.scss';
import { showInviteModal } from '../../components/Invite/InviteModal';
import { aaTrack } from '../../services/tracking';
import { TRACK_DEFINE } from '../../services/tracking/define';
import { cx } from "../../helper/utils";
import CallHistory from "../../components/CallHistory";
import CallHistoryService from "../../services/callHistory"

//resources
import pulseIcon from "../../resources/images/pulse.svg";
import bellIcon from "../../resources/images/bell-ic.svg";

function Header() {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showActivities, setShowActivities] = React.useState(false);
  const [auth, setAuth] = React.useState(authService.auth);
  const history = useHistory();
  const menuRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const activitiesRef = React.useRef(null);
  const activitiesDropdownRef = React.useRef(null);

  React.useEffect(() => {
    CallHistoryService.onHasMissedCall = () => {
      setShowActivities(true)
    }
    authService.onAuthChange(setAuth);

    const handleWindowClick = e => {
      if(
        (triggerRef.current
        &&
        triggerRef.current.contains(e.target))
      ){
        console.log("Clicked inside menu")
      } else {
        setShowMenu(false)
      }

      if(
        (activitiesRef.current
        &&
        activitiesRef.current.contains(e.target))
        ||
        (activitiesDropdownRef.current
        &&
        activitiesDropdownRef.current.contains(e.target))
      ){
        console.log("Clicked inside activities")
      } else {
        setShowActivities(false)
      }
    }

    window.addEventListener("click", handleWindowClick)

    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  }, []);

  const renderAuth = () => {
    return (
      <div className={styles.actions}>
        <button className={styles.feedbackButton} onClick={() => {
            aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_FEEDBACK_FROM_MENU);
            return showFeedbackModal();
        }}>Send feedback</button>

        <div className={styles.activities} ref={activitiesRef}>
          <button onClick={() => {
            setShowActivities(!showActivities)
          }}>
            <img src={bellIcon} />
          </button>
        </div>

        {
          showActivities
          &&
          <div ref={activitiesDropdownRef}>
            <CallHistory/>
          </div>
        }

        <button className={styles.hamburger} onClick={() => {
          aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_HAMBURGER_MENU);
          return onMenuClick();
        }} ref={triggerRef}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </button>

        { showMenu ? 
          <div className={styles.menu} ref={menuRef}>
            <div className={styles.item} onClick={() => {
              aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_INVITE_FROM_MENU);
              showInviteModal();
            }}>Invite your team</div>
            <div className={styles.item} onClick={() => {
              aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_FEEDBACK_FROM_MENU);
              return showFeedbackModal();
            }}>Send feedback</div>
            <div className={styles.item} onClick={() => {
              aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_LOGOUT_FROM_MENU);
              authService.logout();
            }}>Log out</div>
          </div> :
          ''}
      </div>
    )
  }
  const onMenuClick = () => {
    setShowMenu(!showMenu);
  }

  return (
      <div className={cx(styles.container, auth && auth.workspace && styles.hasWorkspace)}>
        <div className={styles.title} onClick={() => history.push("/")}>
          JAM
          <img src={pulseIcon} className={styles.icon}/>

          {
            auth && auth.workspace
            &&
            <span className={styles.workspace}>{auth.workspace}</span>
          }
        </div>
        { auth ? renderAuth() : ''}
      </div>
  )
}

export default Header;