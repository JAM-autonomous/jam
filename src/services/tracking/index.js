import AA from 'autonomous-analytics';
import fingerprintJS from '@fingerprintjs/fingerprintjs';
import config from '../../config/config';
import { logService } from '../log';

const Log = logService.createLog('Tracking');

const aaClient = new AA({ clientSecret: config.AA_CONFIG.API_KEY, debug: !config.IS_PRODUCTION });

const createTrack = ({ platform } = {}) => {
  const trackConfig = {
    userId: null,
    userPseudoId: null,
  };

  /**
   * should call when app load
   */
  const setup = async () => {
    try {
      const fp = await fingerprintJS.load();
      const rs = await fp.get();
  
      // set userPseudoId with device fingerprint
      trackConfig.userPseudoId = rs.visitorId;

      Log.info('Setup track service completed');
    } catch (e) {
      Log.error('Can not finish setting up track service, but may be it still works');
    }
  }

  const setUserId = (userId) => trackConfig.userId = userId;

  const trackEvent = (eventName, eventParams) => {
    aaClient.trackEvent({
      eventName,
      eventParams,
      platform,
      userId: trackConfig.userId,
      userPseudoId: trackConfig.userPseudoId
    });
  };

  const trackPage = (pageName) => {
    aaClient.trackPageView({
      pageName,
      platform
    });
  }

  return {
    trackEvent,
    trackPage,
    setUserId,
    setup
  };
}

export const aaTrack = createTrack({ platform: 'web' });

