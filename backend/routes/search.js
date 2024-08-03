const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    //const results = await Post.find({ $text: { $search: query }, status: 'published' })
    let results = await Post.find({ status: "published" })
      .select("-_id title content author category tags views createdAt")
      .populate("author", "username -_id")
      .populate("category", "name -_id");

    results = results.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author.username.toLowerCase().includes(query.toLowerCase()) ||
        post.category.name.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "An error occurred during the search" });
  }
});

module.exports = router;
