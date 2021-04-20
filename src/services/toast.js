import { ToastsStore } from 'react-toasts';

export const Toast = {
  info(msg, timeout = 5000) {
    ToastsStore.success(msg, timeout, 'toast-message');
  },
  warning(msg, timeout = 5000) {
    ToastsStore.warning(msg, timeout, 'toast-message');
  },
  error(msg, timeout = 5000) {
    ToastsStore.error(msg, timeout, 'toast-message');
  }
};