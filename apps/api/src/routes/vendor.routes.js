import { Router } from "express";
import slugify from "slugify";
import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/", async (req, res) => {
  const q = { approvalStatus: "approved" };
  if (req.query.all === "true") delete q.approvalStatus;
  const vendors = await Vendor.find(q).populate("userId", "name email").sort({ createdAt: -1 });
  res.json(vendors);
});

r.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const vendor = await Vendor.findOne({ $or: [{ slug: idOrSlug }, { _id: idOrSlug.match(/^[0-9a-f]{24}$/) ? idOrSlug : null }] }).populate("userId", "name email");
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  res.json(vendor);
});

r.post("/apply", authRequired, async (req, res) => {
  const existing = await Vendor.findOne({ userId: req.user._id });
  if (existing) return res.status(409).json({ error: "Already applied" });
  const { storeName, description, businessDetails } = req.body;
  const slug = slugify(storeName, { lower: true, strict: true });
  const vendor = await Vendor.create({
    userId: req.user._id,
    storeName,
    slug,
    description,
    businessDetails,
    approvalStatus: "pending",
  });
  await User.findByIdAndUpdate(req.user._id, { role: "vendor" });
  res.json(vendor);
});

r.put("/:id/approve", authRequired, requireRole("admin"), async (req, res) => {
  const v = await Vendor.findByIdAndUpdate(req.params.id, { approvalStatus: req.body.status || "approved" }, { new: true });
  res.json(v);
});

r.put("/:id", authRequired, async (req, res) => {
  const v = await Vendor.findById(req.params.id);
  if (!v) return res.status(404).json({ error: "Not found" });
  if (String(v.userId) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  Object.assign(v, req.body);
  await v.save();
  res.json(v);
});

r.get("/me/store", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const v = await Vendor.findOne({ userId: req.user._id });
  res.json(v);
});

export default r;
