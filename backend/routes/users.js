const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { createNotification } = require("../services/notificationService");

var mongoose = require("mongoose");

const router = express.Router();

// Get User
router.get("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json("User not found...");
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Users
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    const sanitizedUsers = users.map((user) => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update User
router.put("/:id", auth, async (req, res) => {
  const { username, email, password, profilePicture, bio, interests } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
      console.log(req.user.id, " ", user._id);
      return res.status(403).json("Permission Denied");
    }

    const isUserExists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (isUserExists) {
      return res
        .status(400)
        .json("User with the same email or username already exists");
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    if (bio) user.bio = bio;
    if (interests) user.interests = interests;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    const { password: pwd, ...other } = user._doc; // because of destructuring
    await user.save();
    res.status(200).json({ message: "User Updated Successfully", user: other });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete User
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json("User not found");
    }

    if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
      console.log(req.user.id, " ", user._id);
      return res.status(403).json("Permission Denied");
    }
    await user.deleteOne();
    res.status(200).json("User Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//Follow User
router.put("/:id/follow", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    let userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json("User not found");
    }
    let currentUser = await User.findById(req.user.id);
    if (currentUser === userToFollow) {
      return res.status(403).json("You can not follow yourself");
    }
    if (currentUser.followings.includes(userToFollow._id)) {
      return res.status(400).json("You are already following this user");
    }
    currentUser.followings.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    await currentUser.save();
    await userToFollow.save();
    await createNotification("follow", userToFollow, currentUser, "User");
    res
      .status(200)
      .json({ message: "User followed successfully", userToFollow });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//Unfollow User
router.put("/:id/unfollow", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    let userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) {
      return res.status(404).json("User not found");
    }
    let currentUser = await User.findById(req.user.id);
    if (currentUser === userToUnfollow) {
      return res.status(403).json("You can not unfollow yourself");
    }
    if (!currentUser.followings.includes(userToUnfollow._id)) {
      return res.status(400).json("You are not following this user");
    }
    currentUser.followings.pull(userToUnfollow._id);
    userToUnfollow.followers.pull(currentUser._id);
    await currentUser.save();
    await userToUnfollow.save();
    res
      .status(200)
      .json({ message: "User unfollowed successfully", userToUnfollow });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
