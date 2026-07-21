import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: String,
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "vendor", "admin", "staff"], default: "customer", index: true },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
