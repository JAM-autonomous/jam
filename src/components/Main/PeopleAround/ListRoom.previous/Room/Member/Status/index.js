import React from 'react';
import config from '../../../../../../../config/config';
import { logService } from '../../../../../../../services/log';
import './styles.scss';

const Log = logService.createLog("Status");

function Status({ status, room, user, auth }) {
  const roomIsUsedByThisUser = () => {
    return room.userIds.includes(auth.id);
  }
  if (!roomIsUsedByThisUser()) {
    Log.info(`Room (${room.id}) is not using by user ${user.id}`);
    return "";
  }
  if (status === "") {
    return (
      ""
    )
  }
  switch (status) {
    case config.STATUS.FAILED:
      // return <img src={process.env.PUBLIC_URL + '/failed.png'} height="12" />
      return <span className="status-layer">
      <span className="status__red-oval"></span>
    </span>
    case config.STATUS.DISCONNECTED:
      // return <img src={process.env.PUBLIC_URL + '/disconnected.jpg'} height="12" />
      return <span className="status-layer">
      <span className="status__red-oval"></span>
    </span>
    case config.STATUS.CONNECTED:
      return <span className="status-layer">
        <span className="status__green-oval"></span>
      </span>
    case config.STATUS.CLOSED:
      return <span className="status-layer">
      <span className="status__red-oval"></span>
    </span>
    case "new":
      return <span className="status-layer">
      <span className="status__red-oval"></span>
    </span>
    default:
      return `(${status})`;
  }
  
}

export default Status;