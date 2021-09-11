import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema(
  {
    parent_id: {
      type: String,
      default: "root",
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    icon: {
      type: Object,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.categories || mongoose.model("categories", CategoriesSchema);
export default Dataset;
