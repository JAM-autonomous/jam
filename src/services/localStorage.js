
const saveAuth = (auth) => {
  localStorage.setItem('auth',  JSON.stringify(auth));
}

const getAuth = () => {
  const cache = localStorage.getItem('auth');
  if (cache !== null && cache !== undefined) {
    return JSON.parse(cache);
  }
  return undefined;
}

const removeAuth = () => {
  localStorage.removeItem('auth');
}

const jamLocalStorage  = {
  saveAuth,
  getAuth,
  removeAuth
};

export {jamLocalStorage};