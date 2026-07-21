import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    sku: String,
    size: String,
    color: String,
    price: Number,
    stock: { type: Number, default: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    images: [String],
    price: { type: Number, required: true },
    discountPrice: Number,
    stock: { type: Number, default: 0 },
    variants: [variantSchema],
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    tags: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "approved", index: true },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Product", productSchema);
