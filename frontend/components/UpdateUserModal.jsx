"use client";
import React, { useState } from "react";
import styles from "../styles/updateUserModal.module.css";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: "",
    profilePicture: user.profilePicture || "",
    bio: user.bio || "",
    interests: user.interests || [],
    followings: user.followings || [],
    followers: user.followers || [],
    isAdmin: user.isAdmin || false,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    updatedAt: new Date(user.updatedAt).toLocaleDateString(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
    console.log(user, formData, "from Modal.jsx");
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2>Edit User</h2>
        <div className={styles.modalBody}>
          <div className={styles.profileSection}>
            <img
              src={formData.profilePicture || "/noAvatar.jpg"}
              alt="Profile"
              className={styles.profilePicture}
            />
            <p>ID: {user._id}</p>
            <p>Created At: {formData.createdAt}</p>
            <p>Updated At: {formData.updatedAt}</p>
          </div>
          <div className={styles.formSection}>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />

            <label>Bio:</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} />

            <label>Interests:</label>
            <input
              type="text"
              name="interests"
              value={formData.interests.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  interests: e.target.value.split(","),
                })
              }
            />

            <label>Is Admin:</label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
