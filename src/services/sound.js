//resources
import shortSmsSound from '../resources/sound/short_sms.mp3';
import PopSound from '../resources/sound/pop.mp3';
import RingTone from "../resources/sound/ringtone.mp3";

import { logService } from './log';

const Log = logService.createLog('sound');

export async function playNotificationSound({ repeatInterval } = {}) {
  const ringtone = new Audio(RingTone);
  try {
    if (repeatInterval) {
      const timeout = setInterval(() => ringtone.play(), repeatInterval);
      return () => {
        Log.info('turn off playNotificationSound');
        clearInterval(timeout);
        ringtone.pause();
      };
    }
  } catch (e) {
    Log.error('Play notification sound failed, reason: ', e && e.message);
  }
}

export const playPopSound = async () => {
  const track = new Audio(PopSound);
  track.volume = 0.2;
  try {
    setTimeout(() => track.play(), 0);
  } catch (e) {
    Log.error('Play pop sound failed, reason: ', e && e.message);
  }
}