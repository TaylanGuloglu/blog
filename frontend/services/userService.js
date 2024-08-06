const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { getToken } from "./authService";

export const getUsers = async () => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};

export const createUser = async (formData) => {
  try {
    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to create user");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteUser = async (userId) => {
  const token = getToken();
  try {
    const res = await fetch(`${apiUrl}/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateUser = async (userId, formData) => {
  const token = getToken();
  console.log(userId, formData, "service.jsx");
  try {
    const res = await fetch(`${apiUrl}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to update user");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
