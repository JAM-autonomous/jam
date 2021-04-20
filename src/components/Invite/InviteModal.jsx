import React from 'react';
import { Modal } from '../core/Modal';
import Invite from './';

const modalControl = {
  closeModal: null,
  showModal: null,
};

export function showInviteModal() {
  if (typeof modalControl.showModal) {
    modalControl.showModal();
  }
}

export function closeInviteModal() {
  if (typeof modalControl.closeModal) {
    modalControl.closeModal();
  }
}

export const InviteModal = () => {
  const [show, setShow] = React.useState(false);
  const [isCompleted, setCompleted] = React.useState(false);
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);

  React.useEffect(() => {
    modalControl.closeModal = closeModal;
    modalControl.showModal = showModal;
  }, [setShow]);

  const handleClose = () => {
    closeModal();

    // reset state before close modal
    setCompleted(false);
  }

  return (
    <Modal
      show={show}
      onClose={handleClose}
      title={isCompleted ? 'Invitation sent.' : 'Invite your team.'}
     >
      {
        isCompleted
          ? <span style={{ textAlign: 'center' }}>Your team member will receive the invitation in their email inbox.</span>
          : <Invite onSuccess={() => setCompleted(true)} />
      }
    </Modal>
  );
}