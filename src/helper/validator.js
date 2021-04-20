import * as EmailValidator from 'email-validator';

export const emailValidator = (email) => {
  return EmailValidator.validate(email);
}

// const regexEmailRule = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// const regexEmailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const regexNormalRule = /[^a-zA-Z0-9\._]/g;