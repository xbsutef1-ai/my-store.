import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

import Product from "./models/Product.js";
import Order from "./models/Order.js";
import User from "./models/User.js";
import Coupon from "./models/Coupon.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || "glom_secret";

/* ================= DB ================= */
mongoose.connect(process.env.MONGO_URI);

/* ================= AUTH MIDDLEWARE ================= */
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "NO_TOKEN" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "INVALID_TOKEN" });
  }
}

/* ================= CREATE ORDER ================= */
app.post("/api/store/order", auth, async (req, res) => {
  const { productId, planName, couponCode } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "PRODUCT_NOT_FOUND" });

  const plan = product.plans.find(p => p.name === planName);
  if (!plan) return res.status(400).json({ error: "PLAN_NOT_FOUND" });

  if (!plan.keys || plan.keys.length === 0)
    return res.status(400).json({ error: "OUT_OF_STOCK" });

  let price = plan.price;
  let discount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode, active: true });
    if (coupon && (!coupon.expires || coupon.expires > new Date())) {
      if (coupon.type === "percent")
        discount = (price * coupon.value) / 100;
      if (coupon.type === "amount")
        discount = coupon.value;
    }
  }

  const finalPrice = Math.max(0, price - discount);

  // سحب مفتاح
  const key = plan.keys.shift();
  await product.save();

  const order = await Order.create({
    user: req.user.id,
    product: product.title,
    plan: plan.name,
    price,
    discount,
    finalPrice,
    key,
    status: "completed"
  });

  res.json({
    orderId: order._id,
    key,
    finalPrice
  });
});

/* ================= MY ORDERS ================= */
app.get("/api/store/my-orders", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
