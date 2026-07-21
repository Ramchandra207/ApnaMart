import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

import User from "../apps/api/src/models/User.js";
import Vendor from "../apps/api/src/models/Vendor.js";
import Category from "../apps/api/src/models/Category.js";
import Product from "../apps/api/src/models/Product.js";
import Order from "../apps/api/src/models/Order.js";
import Enquiry from "../apps/api/src/models/Enquiry.js";
import Coupon from "../apps/api/src/models/Coupon.js";
import CmsPage from "../apps/api/src/models/CmsPage.js";
import Setting from "../apps/api/src/models/Setting.js";
import Review from "../apps/api/src/models/Review.js";

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/jiet_marketplace";

const img = (q) => `https://source.unsplash.com/800x800/?fashion,${encodeURIComponent(q)}`;

const CATEGORIES = [
  { name: "Men's Clothing", image: img("mens-clothing"), featured: true },
  { name: "Women's Clothing", image: img("womens-clothing"), featured: true },
  { name: "Footwear", image: img("shoes"), featured: true },
  { name: "Accessories", image: img("accessories") },
  { name: "Ethnic Wear", image: img("ethnic-wear"), featured: true },
];

const VENDORS = [
  { store: "Urban Threads", email: "vendor1@jietmart.com", desc: "Contemporary streetwear and everyday essentials." },
  { store: "Ethnic Bazaar", email: "vendor2@jietmart.com", desc: "Handcrafted Indian ethnic wear from Jaipur artisans." },
  { store: "Sole Society", email: "vendor3@jietmart.com", desc: "Premium footwear for men and women." },
];

const PRODUCT_POOL = [
  // Men's clothing
  { cat: 0, v: 0, title: "Classic Oxford Shirt", price: 1499, disc: 999, tags: ["shirt", "formal"] },
  { cat: 0, v: 0, title: "Slim Fit Denim Jeans", price: 1999, disc: 1499, tags: ["jeans"] },
  { cat: 0, v: 0, title: "Cotton Polo T-Shirt", price: 799, disc: 599, tags: ["tshirt", "polo"] },
  { cat: 0, v: 0, title: "Bomber Jacket", price: 2999, disc: 2199, tags: ["jacket"] },
  { cat: 0, v: 0, title: "Chino Trousers", price: 1699, disc: 1299, tags: ["trousers"] },
  { cat: 0, v: 0, title: "Graphic Print Hoodie", price: 1899, disc: 1399, tags: ["hoodie"] },
  // Women's
  { cat: 1, v: 0, title: "Floral Maxi Dress", price: 2499, disc: 1799, tags: ["dress"] },
  { cat: 1, v: 0, title: "High-Waist Skinny Jeans", price: 1899, disc: 1499, tags: ["jeans"] },
  { cat: 1, v: 0, title: "Silk Blouse", price: 2199, disc: 1699, tags: ["blouse"] },
  { cat: 1, v: 0, title: "A-line Midi Skirt", price: 1599, disc: 1199, tags: ["skirt"] },
  { cat: 1, v: 0, title: "Off-Shoulder Top", price: 999, disc: 749, tags: ["top"] },
  { cat: 1, v: 0, title: "Wrap Around Dress", price: 2799, disc: 1999, tags: ["dress"] },
  // Footwear
  { cat: 2, v: 2, title: "Running Sneakers", price: 3999, disc: 2999, tags: ["sneakers", "sports"] },
  { cat: 2, v: 2, title: "Leather Formal Shoes", price: 4499, disc: 3299, tags: ["formal"] },
  { cat: 2, v: 2, title: "Canvas Casual Shoes", price: 1999, disc: 1499, tags: ["casual"] },
  { cat: 2, v: 2, title: "Ankle Boots", price: 3799, disc: 2799, tags: ["boots"] },
  { cat: 2, v: 2, title: "Slip-on Loafers", price: 2999, disc: 2199, tags: ["loafers"] },
  { cat: 2, v: 2, title: "Chunky Platform Sneakers", price: 3499, disc: 2599, tags: ["sneakers"] },
  // Accessories
  { cat: 3, v: 0, title: "Leather Belt", price: 899, disc: 649, tags: ["belt"] },
  { cat: 3, v: 0, title: "Aviator Sunglasses", price: 1499, disc: 999, tags: ["sunglasses"] },
  { cat: 3, v: 0, title: "Analog Wrist Watch", price: 2999, disc: 2199, tags: ["watch"] },
  { cat: 3, v: 0, title: "Canvas Backpack", price: 1799, disc: 1299, tags: ["bag"] },
  { cat: 3, v: 0, title: "Silk Scarf", price: 999, disc: 749, tags: ["scarf"] },
  { cat: 3, v: 0, title: "Beaded Necklace", price: 1299, disc: 899, tags: ["jewellery"] },
  // Ethnic
  { cat: 4, v: 1, title: "Banarasi Silk Saree", price: 5999, disc: 4499, tags: ["saree"] },
  { cat: 4, v: 1, title: "Anarkali Kurta Set", price: 3499, disc: 2599, tags: ["kurta"] },
  { cat: 4, v: 1, title: "Men's Nehru Jacket", price: 2499, disc: 1899, tags: ["jacket"] },
  { cat: 4, v: 1, title: "Embroidered Lehenga", price: 8999, disc: 6499, tags: ["lehenga"] },
  { cat: 4, v: 1, title: "Cotton Kurta Pyjama", price: 1999, disc: 1499, tags: ["kurta"] },
  { cat: 4, v: 1, title: "Chikankari Dupatta", price: 1499, disc: 1099, tags: ["dupatta"] },
];

async function run() {
  await mongoose.connect(MONGO);
  console.log("Connected. Wiping collections...");
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Enquiry.deleteMany({}),
    Coupon.deleteMany({}),
    CmsPage.deleteMany({}),
    Setting.deleteMany({}),
    Review.deleteMany({}),
  ]);

  // Admin
  const adminPass = await bcrypt.hash("Admin@123", 10);
  const admin = await User.create({
    name: "Super Admin",
    email: "admin@jietmart.com",
    password: adminPass,
    role: "admin",
  });

  // Vendor users + vendor profiles
  const vendorPass = await bcrypt.hash("Vendor@123", 10);
  const vendors = [];
  for (const v of VENDORS) {
    const u = await User.create({ name: v.store + " Owner", email: v.email, password: vendorPass, role: "vendor" });
    const ven = await Vendor.create({
      userId: u._id,
      storeName: v.store,
      slug: slugify(v.store, { lower: true, strict: true }),
      description: v.desc,
      logo: img(v.store),
      banner: img(v.store + "-banner"),
      approvalStatus: "approved",
      rating: 4 + Math.random(),
      commission: 10,
    });
    vendors.push(ven);
  }

  // Customers
  const custPass = await bcrypt.hash("Customer@123", 10);
  const customers = [];
  for (let i = 1; i <= 10; i++) {
    const c = await User.create({
      name: `Customer ${i}`,
      email: `customer${i}@jietmart.com`,
      password: custPass,
      role: "customer",
      addresses: [
        {
          label: "Home",
          fullName: `Customer ${i}`,
          phone: `98000000${String(10 + i)}`,
          line1: `${i} MG Road`,
          city: "Jodhpur",
          state: "Rajasthan",
          pincode: "342001",
          isDefault: true,
        },
      ],
    });
    customers.push(c);
  }

  // Categories
  const cats = [];
  for (const c of CATEGORIES) {
    cats.push(await Category.create({ ...c, slug: slugify(c.name, { lower: true, strict: true }), sector: "fashion" }));
  }

  // Products
  const products = [];
  for (const p of PRODUCT_POOL) {
    const doc = await Product.create({
      vendorId: vendors[p.v]._id,
      categoryId: cats[p.cat]._id,
      title: p.title,
      slug: slugify(`${p.title}-${Math.floor(Math.random() * 9999)}`, { lower: true, strict: true }),
      description: `${p.title} — premium quality fashion piece from ${vendors[p.v].storeName}. Comfortable, stylish, and made to last.`,
      images: [img(p.title), img(p.title + "-2"), img(p.title + "-3")],
      price: p.price,
      discountPrice: p.disc,
      stock: 10 + Math.floor(Math.random() * 40),
      variants: [
        { sku: "S", size: "S", stock: 5 },
        { sku: "M", size: "M", stock: 10 },
        { sku: "L", size: "L", stock: 8 },
      ],
      tags: p.tags,
      rating: 3.5 + Math.random() * 1.5,
      numReviews: Math.floor(Math.random() * 100),
      featured: Math.random() > 0.7,
      status: "published",
      approvalStatus: "approved",
    });
    products.push(doc);
  }

  // Orders (15)
  const orders = [];
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  for (let i = 0; i < 15; i++) {
    const cust = customers[i % customers.length];
    const picks = [products[i % products.length], products[(i + 3) % products.length]];
    const items = picks.map((p) => ({
      productId: p._id,
      vendorId: p.vendorId,
      title: p.title,
      image: p.images[0],
      qty: 1 + (i % 3),
      price: p.discountPrice || p.price,
      subtotal: (p.discountPrice || p.price) * (1 + (i % 3)),
      status: "pending",
    }));
    const subtotal = items.reduce((s, x) => s + x.subtotal, 0);
    const shipping = subtotal >= 999 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05);
    orders.push(
      await Order.create({
        orderNo: "ORD" + (100000 + i),
        userId: cust._id,
        items,
        subtotal,
        discount: 0,
        tax,
        shipping,
        total: subtotal + shipping + tax,
        address: cust.addresses[0],
        paymentMode: i % 2 ? "cod" : "online",
        paymentStatus: i % 2 ? "pending" : "paid",
        orderStatus: statuses[i % statuses.length],
        timeline: [{ status: "pending", note: "Order placed" }],
      })
    );
  }

  // Enquiries
  for (let i = 0; i < 8; i++) {
    await Enquiry.create({
      customerId: customers[i % customers.length]._id,
      vendorId: vendors[i % vendors.length]._id,
      productId: products[i]._id,
      subject: "Bulk quote request",
      message: `Please share bulk pricing for 50 units of ${products[i].title}.`,
      quantity: 50,
      type: "bulk",
      status: i % 3 === 0 ? "replied" : "new",
    });
  }

  // Reviews
  for (let i = 0; i < 30; i++) {
    const p = products[i % products.length];
    await Review.create({
      userId: customers[i % customers.length]._id,
      productId: p._id,
      rating: 4 + (i % 2),
      title: "Great product",
      body: "Loved the quality and fit. Delivery was quick.",
    });
  }

  // Coupons
  await Coupon.insertMany([
    { code: "WELCOME10", type: "percent", value: 10, minOrder: 999, status: "active" },
    { code: "FLAT200", type: "flat", value: 200, minOrder: 1499, status: "active" },
    { code: "FASHION25", type: "percent", value: 25, minOrder: 2999, status: "active" },
  ]);

  // Settings
  await Setting.create({
    key: "global",
    businessName: "JIET Fashion Mart",
    contactEmail: "hello@jietmart.com",
    contactPhone: "+91 98000 00000",
    address: "Jodhpur, Rajasthan, India",
    socials: { instagram: "https://instagram.com", facebook: "https://facebook.com" },
    tax: 5,
    shipping: 49,
    freeShippingAbove: 999,
    commission: 10,
    homepageBanners: [
      { title: "New Season Arrivals", subtitle: "Up to 40% off on top styles", image: img("fashion-hero"), cta: "/products" },
      { title: "Ethnic Edit", subtitle: "Handcrafted by Indian artisans", image: img("ethnic-hero"), cta: "/products?category=ethnic-wear" },
    ],
    footer: { about: "JIET Fashion Mart — your multi-vendor fashion marketplace." },
  });

  // CMS pages
  await CmsPage.insertMany([
    {
      slug: "home",
      title: "Home",
      sections: [
        { type: "featured-categories" },
        { type: "trending-products" },
        { type: "top-vendors" },
        { type: "testimonials" },
        { type: "faq" },
      ],
    },
    { slug: "about", title: "About Us", sections: [{ type: "richtext", content: "We are a multi-vendor fashion marketplace built by JIET MERN interns." }] },
    { slug: "contact", title: "Contact", sections: [{ type: "contact-form" }] },
    { slug: "privacy", title: "Privacy Policy", sections: [{ type: "richtext", content: "Your privacy matters to us." }] },
    { slug: "terms", title: "Terms & Conditions", sections: [{ type: "richtext", content: "Standard marketplace terms." }] },
    {
      slug: "faq",
      title: "FAQ",
      sections: [
        { type: "faq-list", items: [
          { q: "How do I track my order?", a: "Go to My Orders in your account." },
          { q: "What is the return policy?", a: "7-day easy returns on eligible items." },
          { q: "Do you offer COD?", a: "Yes, COD is available on most orders." },
        ] },
      ],
    },
  ]);

  console.log("✔ Seed complete");
  console.log("  Admin:    admin@jietmart.com / Admin@123");
  console.log("  Vendor:   vendor1@jietmart.com / Vendor@123");
  console.log("  Customer: customer1@jietmart.com / Customer@123");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
