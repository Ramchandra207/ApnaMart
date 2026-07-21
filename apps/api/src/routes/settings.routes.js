import { Router } from "express";
import Setting from "../models/Setting.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/", async (_req, res) => {
  let s = await Setting.findOne({ key: "global" });
  if (!s) s = await Setting.create({ key: "global" });
  res.json(s);
});

r.put("/", authRequired, requireRole("admin"), async (req, res) => {
  const s = await Setting.findOneAndUpdate({ key: "global" }, req.body, { new: true, upsert: true });
  res.json(s);
});

export default r;
