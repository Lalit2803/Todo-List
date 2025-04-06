
const { Schema, model } = require("mongoose");

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: Boolean,
      default: false,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
         required:true,

    }
  },
  { timestamps: true }
);

module.exports = model("Todo", todoSchema);
