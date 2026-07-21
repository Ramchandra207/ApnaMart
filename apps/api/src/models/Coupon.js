import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percent", "flat"], default: "percent" },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
    validFrom: Date,
    validTo: Date,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
