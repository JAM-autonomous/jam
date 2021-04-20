import React from 'react';
import de from 'debounce';
import http from '../../services/http';
import authService from '../../services/auth';
import { Textarea } from '../core/Textarea';
import { Button } from '../core/Button';
import { ErrorMessage } from '../ErrorMessage';
import styles from './styles.module.scss';
import { aaTrack } from '../../services/tracking';
import { TRACK_DEFINE } from '../../services/tracking/define';

export const SendFeedback = ({ onSuccess }) => {
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState(true);
  const email = authService.auth.email;
  const otherInfo = navigator && navigator.userAgent;

  const handleFailed = () => {
    setError('Sorry, can not send your feedback, please try again');
  };

  const wordCount = (text = '') => {
    try {
      return text.split(/[\n, ]/g).filter(Boolean).length;
    } catch (e) {
      return text.length;
    }
  };

  const onChangeText = (text) => {
    setContent(text);

    if (wordCount(text) < 3) {
      setError('The feedback is too short');
    } else {
      setError('');
    }
  };

  const handleSendFeedback = () => {
    return http.post('api/send-feedback', {
        email,
        content,
        other: otherInfo
    })
      .then(onSuccess)
      .catch(handleFailed);
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <Textarea onTextChange={onChangeText} value={content} className={styles.textarea} placeholder="Share your thoughts here." />
        <ErrorMessage text={error} />
      </div>
      
      <Button disabled={error} onClickAsync={() => {
        aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_FEEDBACK_SEND);
        return handleSendFeedback();
      }}>Submit</Button>
    </div>
  );
}
