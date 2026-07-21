import { Router } from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

r.get("/product/:id", async (req, res) => {
  const items = await Review.find({ productId: req.params.id, status: "approved" }).populate("userId", "name").sort({ createdAt: -1 });
  res.json(items);
});

r.post("/", authRequired, async (req, res) => {
  const { productId, rating, title, body } = req.body;
  const rev = await Review.create({ userId: req.user._id, productId, rating, title, body });
  // Recompute product rating
  const agg = await Review.aggregate([
    { $match: { productId: rev.productId, status: "approved" } },
    { $group: { _id: "$productId", avg: { $avg: "$rating" }, n: { $sum: 1 } } },
  ]);
  if (agg[0]) await Product.findByIdAndUpdate(rev.productId, { rating: agg[0].avg, numReviews: agg[0].n });
  res.json(rev);
});

export default r;
