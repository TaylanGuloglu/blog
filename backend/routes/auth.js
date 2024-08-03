const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isUserExists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (isUserExists) {
      return res.status(400).json({
        message: "User with the same email or username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    //save user and return response
    const user = await newUser.save();
    await createNotification("welcome", newUser._id, newUser._id, "User");

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error)
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid Email");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid Password");
    }
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "5h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
