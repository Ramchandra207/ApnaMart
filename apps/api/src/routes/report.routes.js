import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Enquiry from "../models/Enquiry.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const r = Router();

r.get("/summary", authRequired, requireRole("admin"), async (_req, res) => {
  const [totalOrders, totalRevenueAgg, totalCustomers, totalVendors, pendingEnquiries, lowStock, latestOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, sum: { $sum: "$total" } } }]),
    User.countDocuments({ role: "customer" }),
    Vendor.countDocuments({ approvalStatus: "approved" }),
    Enquiry.countDocuments({ status: "new" }),
    Product.find({ stock: { $lt: 5 } }).select("title stock").limit(10),
    Order.find().sort({ createdAt: -1 }).limit(10).populate("userId", "name"),
  ]);
  res.json({
    totalOrders,
    totalRevenue: totalRevenueAgg[0]?.sum || 0,
    totalCustomers,
    totalVendors,
    pendingEnquiries,
    lowStock,
    latestOrders,
  });
});

r.get("/sales-by-day", authRequired, requireRole("admin"), async (_req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);
  res.json(data);
});

r.get("/export/orders.csv", authRequired, requireRole("admin"), async (_req, res) => {
  const orders = await Order.find().populate("userId", "name email");
  const rows = ["orderNo,customer,total,status,paymentMode,createdAt"];
  for (const o of orders) {
    rows.push(`${o.orderNo},${o.userId?.name || ""},${o.total},${o.orderStatus},${o.paymentMode},${o.createdAt.toISOString()}`);
  }
  res.header("Content-Type", "text/csv").send(rows.join("\n"));
});

export default r;
