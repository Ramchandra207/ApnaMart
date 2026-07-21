import { Router } from "express";
import Notification from "../models/Notification.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

r.get("/", authRequired, async (req, res) => {
  const items = await Notification.find({ recipientId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(items);
});

r.put("/:id/read", authRequired, async (req, res) => {
  const n = await Notification.findOneAndUpdate({ _id: req.params.id, recipientId: req.user._id }, { read: true }, { new: true });
  res.json(n);
});

r.put("/read-all", authRequired, async (req, res) => {
  await Notification.updateMany({ recipientId: req.user._id, read: false }, { read: true });
  res.json({ ok: true });
});

export default r;
