const axios = require("axios");

// Eklemek istediğiniz kategoriler
const categories = [
  { name: "Sport", description: "Posts about sports and news" },
  { name: "Health", description: "Posts about health and wellness" },
  { name: "Travel", description: "Posts about travel and adventures" },
  { name: "Food", description: "Posts about food and recipes" },
  { name: "Education", description: "Posts about education and learning" },
];

// Her kategoriyi eklemek için bir döngü
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTZkYTdhOTQ0ZjU2ODlkYmVjZmI2OSIsImlhdCI6MTcyMjYyNDE4OCwiZXhwIjoxNzIyNjQyMTg4fQ.nSxa0SR9VXnHBjO-F9ikMOU8_0qKy0V4hsn5Ymlo8RY";
categories.forEach(async (category) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/categories",
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Category added:", response.data);
  } catch (error) {
    console.error(
      "Error adding category:",
      error.response ? error.response.data : error.message
    );
  }
});
