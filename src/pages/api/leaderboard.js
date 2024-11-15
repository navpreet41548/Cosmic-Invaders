import User from "../../../models/User"; // Adjust the path to your User model accordingly
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  try {
    // Find the top 10 players sorted by totalKills in descending order
    const topPlayers = await User.find({ totalKills: { $exists: true } }) // Filter out users without totalKills
      .sort({ totalKills: -1 }) // Sort by totalKills in descending order
      .limit(10) // Limit the results to 10 players
      .select("userId username totalKills cosmicToken") // Select specific fields to return
      .lean(); // Convert documents to plain JavaScript objects

    return res.status(200).json({
      message: "Top 10 players retrieved successfully",
      players: topPlayers,
    });
  } catch (error) {
    console.error("Error fetching top players:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
