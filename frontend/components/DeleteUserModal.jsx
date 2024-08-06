import React from "react";
import styles from "../styles/deleteUserModal.module.css";

const DeleteUserModal = ({ onClose, onConfirm }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Are you sure to delete this user?</h3>
        <div className={styles.modalActions}>
          <button className={styles.modalButton} onClick={onClose}>
            No
          </button>
          <button className={styles.modalButton} onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
