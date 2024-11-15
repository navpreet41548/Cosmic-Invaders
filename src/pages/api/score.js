import User from "../../../models/User"; // Adjust the path to your User model accordingly
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  const { userId, tokenAmount, totalEnemiesKilled } = req.body;

  if (!userId || typeof tokenAmount !== "number" || typeof totalEnemiesKilled !== "number") {
    return res.status(400).json({ message: "userId, tokenAmount, and totalEnemiesKilled are required" });
  }

  try {
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's cosmicToken and totalKills
    user.cosmicToken = (user.cosmicToken || 0) + tokenAmount;
    user.totalKills = (user.totalKills || 0) + totalEnemiesKilled;

    // Determine the current base based on totalKills
    const baseLevels = [
      { name: "Base 1", requirement: 0 },
      { name: "Base 2", requirement: 10000 },
      { name: "Base 3", requirement: 20000 },
      { name: "Base 4", requirement: 40000 },
    ];

    const currentBase = baseLevels
      .reverse() // Start checking from the highest level
      .find((base) => user.totalKills >= base.requirement)?.name || "Base 1";

    // Update currentBase field only if it's not already set or needs to be updated
    if (user.currentBase !== currentBase) {
      user.currentBase = currentBase;
    }

    // Save the updated user data
    await user.save();

    return res.status(200).json({
      message: `Awarded ${tokenAmount} and updated current base to ${currentBase}`,
      cosmicToken: user.cosmicToken,
      totalKills: user.totalKills,
      currentBase: user.currentBase,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
