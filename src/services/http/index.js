import axios from 'axios';
import config from '../../config/config';
import { handle403Code } from '../handle403Code';
import { onUiError } from '../handleErrorUI';

const BACKEND_URL = config.BACKEND_SERVER

const http = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

http.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  const { data: responseData } = response || {};

  const { data, error } = responseData || {};

  if (error) {
    throw error;
  }

  return data;
}, (axiosError) => {
  const { response: { data } = {} } = axiosError;
  const { errorMsg } = data || {};
  handle403Code(axiosError, true);
  return Promise.reject(errorMsg || axiosError);
});

export function setToken(token) {
  http.defaults.headers = {
    ...http.defaults.headers,
    token,
  };
}

if (!config.IS_PRODUCTION) {
  window.http = http;
}

export default http;
