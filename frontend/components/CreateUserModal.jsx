import React from "react";
import styles from "../styles/createUserModal.module.css";

const CreateUserModal = ({ closeModal, handleCreateUser }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={closeModal}>
          X
        </button>
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className={styles.submitButton}>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
