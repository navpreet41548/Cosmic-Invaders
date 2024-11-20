import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    userId: { type: String, ref: "User", required: true },
    amount: { type: Number, required: true },
    itemType: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    // transactionHash: { type: String }, // Sparse allows multiple `null` or `undefined` values
    transactionHash: { type: String, unique: true, sparse: true }, // Allow multiple `null` or undefined values
    createdAt: { type: Date, default: Date.now },
  });
  
export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
