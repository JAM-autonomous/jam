import { jamLocalStorage } from "./localStorage";

export const handleClearAuth = () => {
  jamLocalStorage.removeAuth();
  window.location.reload();
}