const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

//Create Comment
router.post("/", auth, async (req, res) => {
  const { content, postId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not Found");
    }
    const newComment = new Comment({
      content,
      author: req.user.id,
      post: postId,
    });
    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();
    res
      .status(200)
      .json({ message: "Comment Created Successfully", newComment });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get All Comments According to Post
router.get("/post/:postId", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
    return res.status(404).json({ message: "Post not found" });
  }
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "comments",
      populate: { path: "author", select: "username" },
    });
    if (!post) {
      console.log(req.params.postId);
      return res.status(404).json("Post not Found");
    }
    res.status(200).json({ postTitle: post.title, comments: post.comments });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Comment
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Comment not found" });
  }

  try {
    const comment = await Comment.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

//Update Comment
router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Comment not found" });
  }
  const { content } = req.body;
  try {
    let comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (req.user.id !== comment.author.toString() && !req.user.isAdmin) {
      console.log(req.user.id, " ", comment.author);
      return res.status(403).json("Permission Denied");
    }
    comment.content = content; // for null check
    await comment.save();
    res.status(200).json({ message: "Comment Updated Successfully", comment });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete Comment
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Comment not found" });
  }
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json("Comment not Found");
    }
    const post = await Post.findById(comment.post);
    if (
      req.user.id !== comment.author.toString() &&
      req.user.id !== post.author.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json("Permission Denied");
    }
    await comment.deleteOne();
    post.comments.pull(comment._id);
    await post.save();
    res.status(200).json("Comment Deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
