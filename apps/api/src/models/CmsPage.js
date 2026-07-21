import mongoose from "mongoose";

const cmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: String,
    sections: { type: Array, default: [] },
    seo: {
      title: String,
      description: String,
      keywords: String,
    },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

export default mongoose.model("CmsPage", cmsPageSchema);
