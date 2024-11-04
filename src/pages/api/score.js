import User from "../../../models/User"; // Adjust the path to your User model accordingly
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  
  const { userId, tokenAmount } = req.body;

  if (!userId || typeof tokenAmount !== 'number') {
    return res.status(400).json({ message: "UserId and tokenAmount are required" });
  }

  try {
   
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // Update user's builderBuck
    user.cosmicToken = (user.cosmicToken || 0) + tokenAmount;

    // Save the updated user data
    await user.save();

    return res.status(200).json({ 
      message: `Awarded ${tokenAmount}`,
      cosmicToken: user.cosmicToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
