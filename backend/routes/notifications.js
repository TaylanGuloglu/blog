const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

const router = express.Router();

// Get User`s Notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const sanitizedNotifications = notifications.map((notification) => ({
      message: notification.message,
      createdAt: notification.createdAt,
    }));
    res.status(200).json(sanitizedNotifications);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Notification as Read
router.put("/:id/read", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json("Notification not found");
  }

  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json("Notification not found");
    }

    notification.read = true;
    await notification.save();

    res.status(200).json("Notification marked as read");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
