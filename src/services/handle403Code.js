import { handleClearAuth } from "./handleClearAuth";
import { logService } from "./log";

const Log = logService.createLog("Handle 403 Code");

export const handle403Code = (err,  isLogout) => {
  Log.info(err.response);
  const { status } = err.response;
  Log.info('status ', status);
  if (status === 403) {
    isLogout && handleClearAuth();
  }
}