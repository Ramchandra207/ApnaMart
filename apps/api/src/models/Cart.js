import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: String,
    qty: { type: Number, default: 1, min: 1 },
    priceAtAdd: Number,
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
    couponCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
