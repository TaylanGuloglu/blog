"use client";
import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../services/userService";
import CreateUserModal from "./CreateUserModal";
import DeleteUserModal from "./DeleteUserModal";
import UpdateUserModal from "./UpdateUserModal";
import styles from "../styles/userTable.module.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    fetchUsers();
  }, []);

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    await createUser(newUser);
    closeCreateUserModal();
    setUsers(await getUsers());
  };

  const handleEditClick = (user) => {
    setUserToUpdate(user);
    setIsUpdateUserModalOpen(true);
  };

  const handleUpdateModalClose = async () => {
    setUserToUpdate(null);
    setIsUpdateUserModalOpen(false);
    setUsers(await getUsers());
  };

  const handleSaveUpdatedUser = async (updatedUserData) => {
    console.log(userToUpdate._id, updatedUserData, "from Users.jsx");
    try {
      await updateUser(userToUpdate._id, updatedUserData);
      
      setUsers(
        users.map((user) =>
          user._id === userToUpdate._id ? { ...user, ...updatedUserData } : user
        )
      );
      handleUpdateModalClose(); 
    } catch (error) {
      console.error("Failed to update user:", error); 
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      setUsers(users.filter((user) => user._id !== userToDelete));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <i className="fas fa-table me-1"></i> Users
          <button className={styles.createButton} onClick={openCreateUserModal}>
            Create
          </button>
        </div>
      </div>
      <div className={styles.cardBody}>
        <table className={`${styles.table} ${styles.tableBordered}`}>
          <thead>
            <tr>
              <th>Username</th>
              <th>ID</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user._id}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                <td>
                  <span
                    onClick={() => handleEditClick(user)}
                    className={styles.editLink}
                  >
                    Edit
                  </span>
                  {" | "}
                  <span
                    onClick={() => handleDeleteClick(user._id)}
                    className={styles.deleteLink}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateUserModalOpen && (
        <CreateUserModal
          closeModal={closeCreateUserModal}
          handleCreateUser={handleCreateUser}
        />
      )}
      {isUpdateUserModalOpen && (
        <UpdateUserModal
          user={userToUpdate}
          onClose={handleUpdateModalClose}
          onSave={handleSaveUpdatedUser}
        />
      )}
      {showDeleteModal && (
        <DeleteUserModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default UsersTable;
