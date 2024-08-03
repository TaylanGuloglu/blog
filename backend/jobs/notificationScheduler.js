const cron = require("node-cron");
const Notification = require("../models/Notification");

// Define Delete Notification Job
const startNotificationCleanupJob = () => {
  cron.schedule("*/2 * * * *", async () => {
    console.log("Job is running to delete old notifications");
    const now = new Date();
    const twoMinsAgo = new Date(now.getTime() - 2 * 60 * 1000);

    try {
      const result = await Notification.deleteMany({
        read: true,
        updatedAt: { $lte: twoMinsAgo.toISOString() } //  ISO format 
      });
      console.log(`Deleted ${result.count} notifications`);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = startNotificationCleanupJob;