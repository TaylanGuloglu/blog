const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const categoryRoute = require("./routes/categories");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const notificationRoute = require("./routes/notifications");
const searchRoute = require("./routes/search");
//const startNotificationCleanupJob = require("./jobs/notificationScheduler")

const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(cors());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    throw err;
  }
};

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api", searchRoute);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

// Run Jobs
//startNotificationCleanupJob();

app.listen(PORT, () => {
  connect();
  console.log(`Server is running on ${PORT}`);
});
