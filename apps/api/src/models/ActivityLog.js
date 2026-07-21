import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorRole: String,
    action: String,
    target: String,
    targetId: String,
    meta: Object,
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
