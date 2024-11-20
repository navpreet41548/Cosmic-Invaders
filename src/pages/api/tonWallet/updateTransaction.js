import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import Transaction from "../../../../models/Transaction";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { transactionId, transactionHash } = req.body;

  if (!transactionId || !transactionHash) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    await dbConnect();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Update the transaction status
    transaction.status = "completed";
    transaction.transactionHash = transactionHash;
    await transaction.save();

    // Reward the user based on the itemType
    const user = await User.findOne({ userId: transaction.userId }); // Find user by string userId
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cosmicTokenAmount = parseInt(transaction.itemType.split(" ")[0], 10);
    if (!isNaN(cosmicTokenAmount)) {
      user.cosmicToken = (user.cosmicToken || 0) + cosmicTokenAmount;
    }

    const updatedUser = await user.save();

    return res.status(200).json({ success: true, user:updatedUser });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}