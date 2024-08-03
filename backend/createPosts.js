const axios = require("axios");

// Kullanıcılar ve kategoriler (IDs ile güncellenmelidir)
const users = [
  { id: "66aaa3c432feb805b0046c58", username: "michael_smith" },
  { id: "66aaa3c432feb805b0046c5e", username: "sarah_jones" },
  { id: "66aaa3c432feb805b0046c5c", username: "david_wilson" },
  { id: "66aaa3c432feb805b0046c60", username: "emily_davis" },
  { id: "66aaa3c532feb805b0046c7a", username: "james_brown" },
  { id: "66aaa3c532feb805b0046c78", username: "linda_martin" },
  { id: "66aaa3c432feb805b0046c62", username: "robert_taylor" },
  { id: "66aaa3c432feb805b0046c6a", username: "patricia_moore" },
  { id: "66aaa3c432feb805b0046c6e", username: "john_anderson" },
  { id: "66aaa3c432feb805b0046c6c", username: "mary_thomas" },
];

// Örnek kategoriler (gerçek IDs ile güncellenmelidir)
const categories = [
  "66a969b0ccd4e76d53a3ba04", // Teknoloji
  "66ad2930897f519ee34ca9b0", // Sağlık
  "66ad2930897f519ee34ca9b2", // Seyahat
  "66ad2930897f519ee34ca9b4", // Yemek
  "66ad2930897f519ee34ca9b6", // Eğitim
];

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTZkYTdhOTQ0ZjU2ODlkYmVjZmI2OSIsImlhdCI6MTcyMjYyNDE4OCwiZXhwIjoxNzIyNjQyMTg4fQ.nSxa0SR9VXnHBjO-F9ikMOU8_0qKy0V4hsn5Ymlo8RY";

// Her kullanıcı için iki tane post eklemek
users.forEach(async (user) => {
  try {
    // İlk post
    let post = {
      title: `First post by ${user.username}`,
      content: `This is the first post by ${user.username}.`,
      author: user.id,
      category: categories[Math.floor(Math.random() * categories.length)],
    };
    let response = await axios.post("http://localhost:3000/api/posts", post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Post added:", response.data);

    // İkinci post
    post = {
      title: `Second post by ${user.username}`,
      content: `This is the second post by ${user.username}.`,
      author: user.id,
      category: categories[Math.floor(Math.random() * categories.length)],
    };
    response = await axios.post("http://localhost:3000/api/posts", post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Post added:", response.data);
  } catch (error) {
    console.error(
      "Error adding post for user",
      user.username,
      ":",
      error.response ? error.response.data : error.message
    );
  }
});
