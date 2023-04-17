import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
export const PostModel = mongoose.model("Post", postSchema);
