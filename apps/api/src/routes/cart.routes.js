import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

r.get("/", authRequired, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  res.json(cart);
});

r.post("/add", authRequired, async (req, res) => {
  const { productId, qty = 1, variantId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  const existing = cart.items.find((i) => String(i.productId) === productId && (i.variantId || "") === (variantId || ""));
  if (existing) existing.qty += qty;
  else cart.items.push({ productId, qty, variantId, priceAtAdd: product.discountPrice || product.price });
  await cart.save();
  await cart.populate("items.productId");
  res.json(cart);
});

r.put("/item/:itemId", authRequired, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  const item = cart?.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (req.body.qty !== undefined) item.qty = req.body.qty;
  await cart.save();
  await cart.populate("items.productId");
  res.json(cart);
});

r.delete("/item/:itemId", authRequired, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items.id(req.params.itemId)?.deleteOne();
  await cart.save();
  await cart.populate("items.productId");
  res.json(cart);
});

r.delete("/", authRequired, async (req, res) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], couponCode: null });
  res.json({ ok: true });
});

export default r;
