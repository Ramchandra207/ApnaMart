import { Router } from "express";
import Enquiry from "../models/Enquiry.js";
import Vendor from "../models/Vendor.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.post("/", authRequired, async (req, res) => {
  const { vendorId, productId, subject, message, quantity, type } = req.body;
  const e = await Enquiry.create({
    customerId: req.user._id,
    vendorId,
    productId,
    subject,
    message,
    quantity,
    type,
  });
  res.json(e);
});

r.get("/mine", authRequired, async (req, res) => {
  const q = req.user.role === "customer" ? { customerId: req.user._id } : {};
  if (req.user.role === "vendor") {
    const v = await Vendor.findOne({ userId: req.user._id });
    if (!v) return res.json([]);
    q.vendorId = v._id;
  }
  const items = await Enquiry.find(q).populate("customerId", "name email").populate("productId", "title").sort({ createdAt: -1 });
  res.json(items);
});

r.get("/", authRequired, requireRole("admin"), async (_req, res) => {
  const items = await Enquiry.find().populate("customerId", "name email").populate("productId", "title").sort({ createdAt: -1 });
  res.json(items);
});

r.put("/:id/reply", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const e = await Enquiry.findById(req.params.id);
  if (!e) return res.status(404).json({ error: "Not found" });
  e.replies.push({ byUserId: req.user._id, message: req.body.message, price: req.body.price, availability: req.body.availability });
  e.status = "replied";
  await e.save();
  res.json(e);
});

r.put("/:id/status", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const e = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(e);
});

export default r;
