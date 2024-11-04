import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  const { userId, amount } = req.body;

  if (!userId || typeof amount !== "number") {
    return res.status(400).json({ message: "UserId and amount are required" });
  }

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if ((user.cosmicToken || 0) < amount) {
      return res.status(400).json({ message: "Insufficient cosmic tokens" });
    }

    user.cosmicToken -= amount;
    await user.save();

    return res.status(200).json({
      message: "Cosmic token deducted",
      cosmicToken: user.cosmicToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
