// option 1: 
import { LogService } from 'logging-client';
import config from '../../config/config';

export const logService =  new LogService(config.IS_PRODUCTION ? 'prod' : 'dev', 'frontend');
