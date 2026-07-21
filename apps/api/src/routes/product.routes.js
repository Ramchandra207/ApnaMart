import { Router } from "express";
import slugify from "slugify";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

// List with filters, search, pagination
r.get("/", async (req, res) => {
  const {
    q,
    category,
    vendor,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort = "-createdAt",
    page = 1,
    limit = 20,
    featured,
  } = req.query;

  const filter = { status: "published", approvalStatus: "approved" };
  if (q) filter.$text = { $search: q };
  if (category) filter.categoryId = category;
  if (vendor) filter.vendorId = vendor;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (inStock === "true") filter.stock = { $gt: 0 };
  if (featured === "true") filter.featured = true;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("vendorId", "storeName slug")
      .populate("categoryId", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) });
});

r.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const p = await Product.findOne({
    $or: [{ slug: idOrSlug }, { _id: idOrSlug.match(/^[0-9a-f]{24}$/) ? idOrSlug : null }],
  })
    .populate("vendorId", "storeName slug logo")
    .populate("categoryId", "name slug");
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

r.post("/", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor && req.user.role !== "admin") return res.status(400).json({ error: "Vendor profile missing" });
  const slug = slugify(`${req.body.title}-${Date.now()}`, { lower: true, strict: true });
  const p = await Product.create({
    ...req.body,
    slug,
    vendorId: req.body.vendorId || vendor?._id,
    approvalStatus: req.user.role === "admin" ? "approved" : "pending",
  });
  res.json(p);
});

r.put("/:id", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin") {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor || String(p.vendorId) !== String(vendor._id)) return res.status(403).json({ error: "Forbidden" });
  }
  Object.assign(p, req.body);
  await p.save();
  res.json(p);
});

r.delete("/:id", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin") {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor || String(p.vendorId) !== String(vendor._id)) return res.status(403).json({ error: "Forbidden" });
  }
  await p.deleteOne();
  res.json({ ok: true });
});

// Vendor's own products
r.get("/vendor/mine", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.json([]);
  const items = await Product.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
  res.json(items);
});

// Admin approval
r.put("/:id/approve", authRequired, requireRole("admin"), async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, { approvalStatus: req.body.status || "approved" }, { new: true });
  res.json(p);
});

export default r;
