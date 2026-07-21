import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: String,
    banner: String,
    description: String,
    businessDetails: {
      gstin: String,
      pan: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending", index: true },
    rating: { type: Number, default: 0 },
    commission: { type: Number, default: 10 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
