import { Router } from "express";
import User from "../models/User.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/", authRequired, requireRole("admin"), async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

r.get("/me/addresses", authRequired, async (req, res) => {
  res.json(req.user.addresses || []);
});

r.post("/me/addresses", authRequired, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.json(user.addresses);
});

r.put("/me/profile", authRequired, async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true }
  ).select("-password");
  res.json(user);
});

r.post("/me/wishlist/:productId", authRequired, async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.productId;
  const idx = user.wishlist.findIndex((x) => String(x) === pid);
  if (idx >= 0) user.wishlist.splice(idx, 1);
  else user.wishlist.push(pid);
  await user.save();
  res.json(user.wishlist);
});

r.put("/:id/status", authRequired, requireRole("admin"), async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select("-password");
  res.json(u);
});

export default r;
