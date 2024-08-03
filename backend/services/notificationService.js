const Notification = require("../models/Notification");
const Post = require("../models/Post");
const User = require("../models/User");

const createNotification = async (type, recipient, source, sourceModel) => {
  let message;
  //const sourceUser = await User.findById(source);
  switch (type) {
    case "welcome":
      message = "Welcome to the blog app!";
      break;
    case "follow":
      message = `${source.username} started following you.`;
      break;
    case "comment":
      message = `${source.username} commented on your post.`;
      break;
    case "like":
      message = `${source.username || "Someone"} liked your post.`;
      break;
    case "view":
      message = `Your post has been viewed.`;
      break;
    case "new_post":
      const post = await Post.findById(source).populate("author", "username");
      message = `${post.author.username} has published a new post: "${post.title}".`;
      break;
    default:
      message = "You have a new notification.";
  }

  const notification = new Notification({
    type,
    message,
    recipient,
    source: source,
    sourceModel,
  });

  await notification.save();
};

module.exports = {
  createNotification,
};
