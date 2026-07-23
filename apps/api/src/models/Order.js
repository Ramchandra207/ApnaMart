import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", index: true },
    title: String,
    image: String,
    variant: String,
    qty: Number,
    price: Number,
    subtotal: Number,
    status: {
      type: String,
      enum: ["pending", "accepted", "packed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
  },
  { _id: true }
);

const timelineEventSchema = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    status: String,
    note: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNo: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    subtotal: Number,
    discount: Number,
    tax: Number,
    shipping: Number,
    total: Number,
    couponCode: String,
    address: Object,
    paymentMode: { type: String, enum: ["cod", "online"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
      index: true,
    },
    timeline: [timelineEventSchema],
    returnRequests: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId },
        reason: String,
        status: { type: String, enum: ["requested", "approved", "rejected", "refunded"], default: "requested" },
        note: String,
        requestedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
