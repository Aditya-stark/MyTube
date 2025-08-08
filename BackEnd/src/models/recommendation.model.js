import mongoose from "mongoose";

const recommendationsSchema = new mongoose.Schema(
  {
    video_id: {
      type: String,
      required: true,
    },
    recommended_ids: {
      type: [String], // array of recommended video IDs
      required: true,
    },
  },
  { timestamps: true }
);

export const Recommendations = mongoose.model("Recommendations", recommendationsSchema);