const express = require("express");
const mongoose = require("mongoose");

const Post = require("../models/Post");
const auth = require("../middleware/auth");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

const router = express.Router();

//Create Post
router.post("/", auth, async (req, res) => {
  const { title, content, category, status } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      category,
      author: req.user.id,
      status: status || "draft",
    });
    await newPost.save();
    if (newPost.status === "published") {
      const user = await User.findById(req.user.id).populate(
        "followers",
        "username"
      );
      const followers = user.followers;
      for (let follower of followers) {
        await createNotification("new_post", follower._id, newPost._id, "Post");
      }
    }
    res.status(200).json({ message: "Post Created Successfully", newPost });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Post
router.get("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Post not found" });
  }
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email")
      .populate("category", "name")
      .populate("comments");
    if (!post) {
      return res.status(404).json("Post not Found");
    }
    if (req.user.id !== post.author.id && post.status !== "published") {
      return res.status(404).json("Post not Found");
    }
    const user = await User.findById(req.user.id);

    if (
      !user.viewedPosts.includes(req.params.id) &&
      req.user.id !== post.author.id
    ) {
      post.views += 1;
      await post.save();

      user.viewedPosts.push(req.params.id);
      await user.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//Get All Posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .populate("category", "name")
      .populate("comments");
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//Get User's Post
router.get("/user/:userId", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    let posts = await Post.find({ author: req.params.userId });
    if (req.user.id !== req.params.userId) {
      posts = posts.filter((post) => post.status === "published");
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update Post
router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Post not found" });
  }
  const { title, content, category, status } = req.body;
  try {
    let post = await Post.findById(req.params.id);
    console.log(post);
    if (!post) {
      return res.status(404).json("Post not Found");
    }
    if (req.user.id !== post.author.toString() && !req.user.isAdmin) {
      return res.status(403).json("Permission Denied");
    }
    const previousStatus = post.status;
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;

    await post.save();
    if (post.status === "published" && previousStatus !== "published") {
      const user = await User.findById(req.user.id).populate(
        "followers",
        "username"
      );
      const followers = user.followers;
      for (let follower of followers) {
        await createNotification("new_post", follower._id, post._id, "Post");
      }
    }
    res.status(200).json({ message: "Post Updated Successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//Delete Post
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Post not found" });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not Found");
    }
    if (req.user.id !== post.author && !req.user.isAdmin) {
      return res.status(403).json("Permission Denied");
    }
    await post.deleteOne();
    res.status(200).json("Post Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Like a Post
router.put("/:id/like", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Post not found" });
  }
  try {
    let post = await Post.findById(req.params.id);
    let currentUser = await User.findById(req.user.id);

    if (!post) {
      return res.status(404).json("Post no found");
    }
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json("You already liked this post");
    }
    post.likes.push(req.user.id);
    await post.save();

    const likeCount = post.likes.length;

    if (likeCount === 1 || likeCount % 10 === 0) {
      await createNotification("like", post.author, currentUser, "User");
    }

    res.status(200).json({ message: "Post liked successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//Unlike a Post
router.put("/:id/unlike", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Post not found" });
  }
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json("You have not liked this post");
    }
    post.likes.pull(req.user.id);
    await post.save();

    res.status(200).json({ message: "Post unliked successfully", post });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
