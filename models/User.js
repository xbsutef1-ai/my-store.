import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  role: { type: String, default: "user" }
});

export default mongoose.model("User", UserSchema);
