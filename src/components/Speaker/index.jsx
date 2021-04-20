import React, { useState } from 'react';
import './styles.scss';

function Speaker({ peer }) {
  const [speaker, setSpeaker] = useState(peer.peer.speaker);
  peer.peer.setSpeaker = setSpeaker;
  const on = () => {
    peer.peer.updateSpeaker(true);
  };
  const off = () => {
    peer.peer.updateSpeaker(false);
  };
  return (
    <div className="speaker">
      { speaker ?
        <img className="on" src={process.env.PUBLIC_URL + '/on.png'} width="25" height="30" onClick={off} />
        :
        <img className="off" src={process.env.PUBLIC_URL + '/off.png'} width="25" height="30" onClick={on} />
      }
    </div>
  )
}

export default Speaker;
