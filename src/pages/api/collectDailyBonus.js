import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { userId, dailyBonusId } = req.body;

  if (!userId || !dailyBonusId) {
    return res
      .status(400)
      .json({ error: "User ID and daily bonus ID are required." });
  }

  try {
    await dbConnect();
    // Convert dailyBonusId to ObjectId using the 'new' keyword
    const dailyBonusObjectId = new mongoose.Types.ObjectId(dailyBonusId);

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the daily bonus
    const dailyBonus = user.dailyBonus.find(
      (bonus) => bonus._id.toString() === dailyBonusObjectId.toString()
    );

    if (!dailyBonus) {
      return res.status(404).json({ error: "Daily bonus not found." });
    }

    // Check if the bonus is available and not collected
    const now = new Date();
    if (new Date(dailyBonus.availableOn) > now) {
      return res.status(400).json({ error: "Bonus not available yet." });
    }

    if (dailyBonus.collected) {
      return res.status(400).json({ error: "Bonus already collected." });
    }

    // Mark the bonus as collected
    dailyBonus.collected = true;
    dailyBonus.collectedOn = now;

    // Update the user's reward based on the bonus reward
    let rewardDetails = "";
    if (dailyBonus.reward.includes("Cosmic Token")) {
      const tokenAmount = parseInt(dailyBonus.reward.split(" ")[0], 10);
      user.cosmicToken += tokenAmount;
      rewardDetails = `${tokenAmount} Cosmic Token`;
    } else if (dailyBonus.reward.includes("$Pro Coin")) {
      const coinAmount = parseInt(dailyBonus.reward.split(" ")[0], 10);
      user.proCoin += coinAmount;
      rewardDetails = `${coinAmount} $Pro Coins`;
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Bonus collected and rewards updated successfully.",
      user,
      reward: rewardDetails, // Include the reward details in the response
    });
  } catch (error) {
    console.error("Error handling daily bonus collection:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
