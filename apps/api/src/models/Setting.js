import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    businessName: { type: String, default: "Apna Mart" },
    logo: String,
    favicon: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    socials: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
    },
    payment: {
      cod: { type: Boolean, default: true },
      online: { type: Boolean, default: true },
    },
    tax: { type: Number, default: 5 },
    shipping: { type: Number, default: 49 },
    freeShippingAbove: { type: Number, default: 999 },
    commission: { type: Number, default: 10 },
    maintenanceMode: { type: Boolean, default: false },
    homepageBanners: { type: Array, default: [] },
    footer: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
