import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true }, // Unique identifier for each task
  isCompleted: { type: Boolean, default: false }, // Track if task is completed
  collectedAt: { type: Date }, // Track when the reward was collected
});

const DailyTaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User ID for tracking tasks per user
    tasks: [TaskSchema], // Array of tasks for the user
  },
  { timestamps: true }
); // Automatically manage createdAt and updatedAt fields

export default mongoose.models.DailyTask ||
  mongoose.model("DailyTask", DailyTaskSchema);
