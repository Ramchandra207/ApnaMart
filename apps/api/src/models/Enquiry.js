import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    byUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    price: Number,
    availability: String,
    at: { type: Date, default: Date.now },
  },
  { _id: true }
);

const enquirySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    subject: String,
    message: String,
    quantity: Number,
    type: { type: String, enum: ["question", "quote", "bulk"], default: "question" },
    replies: [replySchema],
    status: { type: String, enum: ["new", "replied", "accepted", "rejected", "converted"], default: "new", index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
