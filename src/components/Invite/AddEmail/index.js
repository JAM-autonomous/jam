import React from 'react';
import { cx } from '../../../helper/utils';
import { emailValidator } from '../../../helper/validator';
import { Input } from '../../core/Input';
import { ErrorMessage } from '../../ErrorMessage';
import closeIcon from '../../../resources/images/icon_close_round.png';
import styles from './styles.module.scss';

function AddEmail({ emails, setEmails }) {
    const [inviteEmail, setInviteEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState("");

    const onAdd = () => {
        if (!valid()) {
            setEmailError(checkEmail());
            return;
        }

        setEmails([...emails, inviteEmail]);
        setInviteEmail("")
    }
    const duplicatedEmail = () => {
        return emails.includes(inviteEmail);
    }
    const validEmail = () => {
        return emailValidator(inviteEmail);
    }
    const valid = () => {
        return validEmail() && !duplicatedEmail();
    }

    const noEmail = () => {
        return inviteEmail === "";
    }
    const onInviteEmailChange = (email) => {
        setInviteEmail(String(email || '').toLowerCase());
        setEmailError("")
    }
    const onKeyUp = (e) => {
        if (e.keyCode === 13) { //on enter
            onAdd();
        }
    }
    const removeEmail = (removedEmail) => {
        setEmails([...emails].filter(e => e !== removedEmail))
    }

    const checkEmail = () => {
        if (noEmail()) return 'Please enter your email.';
        if (!validEmail()) return 'Please enter a valid email address.';
        if (duplicatedEmail()) return 'Email existed.';
        return null;
    }

    return (
        <div className={styles.container}>
      <div className={styles.inputEmail}>
        <Input
          onKeyUp={onKeyUp}
          className={`input ${noEmail() ? '' : (valid() ? 'valid' : 'invalid')}`}
          value={inviteEmail}
          onTextChange={onInviteEmailChange}
          placeholder="Enter an email address"
        />
        <ErrorMessage text={emailError} />
      </div>
      <div className={styles.emailList}>
        {
          emails.map(email => {
            return (
              <div className={styles.emailItem} key={email}>
                <span className={styles.email}>{email}</span>
                <img src={closeIcon} className={styles.clearEmailBtn} onClick={() => removeEmail(email)} />
              </div>
            )
          })
        }
      </div>
    </div>
    )
}

export default AddEmail;