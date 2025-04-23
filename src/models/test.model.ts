import mongoose, { Schema } from "mongoose";

const testSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Test = mongoose.model("Test", testSchema);
