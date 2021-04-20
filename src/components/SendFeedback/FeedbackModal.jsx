import React from 'react';
import { Modal } from '../core/Modal';
import { SendFeedback } from './';

const modalControl = {
  closeModal: null,
  showModal: null,
};

export function showFeedbackModal() {
  if (typeof modalControl.showModal) {
    modalControl.showModal();
  }
}

export function closeFeedbackModal() {
  if (typeof modalControl.closeModal) {
    modalControl.closeModal();
  }
}

export const FeedbackModal = () => {
  const [show, setShow] = React.useState(false);
  const [isCompleted, setCompleted] = React.useState(false);
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);

  React.useEffect(() => {
    modalControl.closeModal = closeModal;
    modalControl.showModal = showModal;
  }, []);

  const handleClose = () => {
    closeModal();

    // reset state before close modal
    setCompleted(false);
  }

  return (
    <Modal show={show} onClose={handleClose} title={isCompleted ? 'Thanks for sharing your thoughts.' : 'How would you improve JAM?'}>
      {
        isCompleted
          ? <span style={{ textAlign: 'center' }}>Your feedback will be super helpful. Thanks for using Jam!</span>
          : <SendFeedback onSuccess={() => setCompleted(true)} />
      }
    </Modal>
  );
}