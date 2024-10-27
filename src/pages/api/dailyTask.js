import dbConnect from "../../../utils/dbConnect"; // Assuming you have a db connection utility
import User from "../../../models/User"; // Import your Mongoose User model
import DailyTask from "../../../models/DailyTask";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { userId, taskName } = req.body;

    try {
      // Find or create the daily task record for the user
      let dailyTask = await DailyTask.findOne({ userId });

      if (!dailyTask) {
        // If no daily task record exists, create one with the new task
        dailyTask = new DailyTask({
          userId,
          tasks: [{ taskName, isCompleted: false }],
        });
      }

      // Find the task by taskName in the tasks array
      const task = dailyTask.tasks.find((t) => t.taskName === taskName);

      if (task) {
        // If the task is already completed, return an error
        if (task.isCompleted) {
          return res
            .status(200)
            .json({ message: "Reward already collected for this task" });
        }

        // Mark the task as completed and update the collection date
        task.isCompleted = true;
        task.collectedAt = new Date();
      } else {
        // If the task does not exist, add it to the tasks array and mark it completed
        dailyTask.tasks.push({
          taskName,
          isCompleted: true,
          collectedAt: new Date(),
        });
      }

      // Update the user's catchToken by 25
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.cosmicToken += 25;
      await user.save();

      // Save the updated daily task document
      await dailyTask.save();

      res.status(200).json({ success: true, cosmicToken: user.cosmicToken });
    } catch (error) {
      console.error("Error processing daily task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
