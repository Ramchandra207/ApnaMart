import { Router } from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import Setting from "../models/Setting.js";
import Coupon from "../models/Coupon.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

const genOrderNo = () => "ORD" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);

r.post("/", authRequired, async (req, res) => {
  const { address, paymentMode = "cod", couponCode } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart is empty" });
  const setting = (await Setting.findOne({ key: "global" })) || (await Setting.create({ key: "global" }));

  const items = cart.items.map((i) => {
    const p = i.productId;
    const price = i.priceAtAdd || p.discountPrice || p.price;
    return {
      productId: p._id,
      vendorId: p.vendorId,
      title: p.title,
      image: p.images?.[0],
      variant: i.variantId,
      qty: i.qty,
      price,
      subtotal: price * i.qty,
    };
  });

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);

  let discount = 0;
  if (couponCode) {
    const c = await Coupon.findOne({ code: couponCode.toUpperCase(), status: "active" });
    if (c && subtotal >= (c.minOrder || 0)) {
      discount = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
      c.used += 1;
      await c.save();
    }
  }

  const shipping = subtotal >= (setting.freeShippingAbove || 0) ? 0 : setting.shipping || 0;
  const tax = Math.round(((subtotal - discount) * (setting.tax || 0)) / 100);
  const total = subtotal - discount + shipping + tax;

  const order = await Order.create({
    orderNo: genOrderNo(),
    userId: req.user._id,
    items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    couponCode: couponCode?.toUpperCase(),
    address,
    paymentMode,
    paymentStatus: paymentMode === "cod" ? "pending" : "paid",
    orderStatus: "pending",
    timeline: [{ status: "pending", note: "Order placed", by: req.user._id }],
  });

  // Deduct stock
  for (const i of items) {
    await Product.findByIdAndUpdate(i.productId, { $inc: { stock: -i.qty } });
  }

  cart.items = [];
  cart.couponCode = null;
  await cart.save();

  res.json(order);
});

r.get("/mine", authRequired, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

r.get("/", authRequired, requireRole("admin"), async (_req, res) => {
  const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

r.get("/vendor/mine", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) return res.json([]);
  const orders = await Order.find({ "items.vendorId": vendor._id })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

r.get("/:id", authRequired, async (req, res) => {
  const o = await Order.findById(req.params.id).populate("userId", "name email");
  if (!o) return res.status(404).json({ error: "Not found" });
  if (req.user.role === "customer" && String(o.userId._id) !== String(req.user._id))
    return res.status(403).json({ error: "Forbidden" });
  if (req.user.role === "vendor") {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor || !o.items.some((item) => String(item.vendorId) === String(vendor._id)))
      return res.status(403).json({ error: "Forbidden" });
  }
  res.json(o);
});

r.put("/:id/status", authRequired, requireRole("vendor", "admin"), async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid order status" });
  const o = await Order.findById(req.params.id);
  if (!o) return res.status(404).json({ error: "Not found" });
  if (req.user.role === "vendor") {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    const vendorItems = o.items.filter((item) => String(item.vendorId) === String(vendor?._id));
    if (!vendorItems.length) return res.status(403).json({ error: "Forbidden" });
    vendorItems.forEach((item) => { item.status = status === "processing" ? "accepted" : status; });
    const itemStatuses = o.items.map((item) => item.status);
    if (itemStatuses.every((itemStatus) => itemStatus === "delivered")) o.orderStatus = "delivered";
    else if (itemStatuses.every((itemStatus) => itemStatus === "cancelled")) o.orderStatus = "cancelled";
    else o.orderStatus = status;
  } else {
    o.orderStatus = status;
    o.items.forEach((item) => { item.status = status === "processing" ? "accepted" : status; });
  }
  o.timeline.push({ status, note, by: req.user._id });
  await o.save();
  res.json(o);
});

r.post("/:id/returns", authRequired, async (req, res) => {
  const { itemId, reason } = req.body;
  const o = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!o) return res.status(404).json({ error: "Order not found" });
  const item = o.items.id(itemId);
  if (!item) return res.status(400).json({ error: "Order item not found" });
  if (item.status !== "delivered") return res.status(400).json({ error: "Only delivered items can be returned" });
  if (o.returnRequests.some((request) => String(request.itemId) === String(itemId))) return res.status(409).json({ error: "Return already requested" });
  o.returnRequests.push({ itemId, reason });
  o.timeline.push({ status: "return-requested", note: `Return requested: ${reason}`, by: req.user._id });
  await o.save();
  res.status(201).json(o);
});

export default r;
