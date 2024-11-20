import dbConnect from "../../../../utils/dbConnect";
import Transaction from "../../../../models/Transaction";

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { userId, amount, itemType } = req.body;
  
    if (!userId || !amount || !itemType) {
      return res.status(400).json({ error: "Invalid request data" });
    }
  
    try {
      await dbConnect();
  
      const transaction = await Transaction.create({
        userId, // Use userId as a string
        amount,
        itemType,
        status: "pending",
        transactionHash: undefined,
      });
  
      return res.status(200).json({ success: true, transactionId: transaction._id });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }