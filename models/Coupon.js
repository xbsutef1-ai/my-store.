import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["percent", "amount"], // نسبة % أو مبلغ ثابت
    required: true
  },

  value: {
    type: Number,
    required: true
  },

  expires: {
    type: Date,
    default: null
  },

  active: {
    type: Boolean,
    default: true
  },

  maxUses: {
    type: Number,
    default: null // null = غير محدود
  },

  usedCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Coupon", CouponSchema);