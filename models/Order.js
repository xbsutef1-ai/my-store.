import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  productTitle: String,
  planName: String,
  email: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending"
  },

  deliveredKey: { type: String, default: null },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
