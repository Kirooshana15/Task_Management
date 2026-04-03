const mongoose = require("mongoose");

const PRIORITIES = ["Low", "Medium", "High"];
const WORK_ITEM_STATUSES = ["Todo", "In Progress", "Review", "Done"];

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

const workItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: [true, "Request ID is required"],
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assignee is required"],
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: WORK_ITEM_STATUSES,
      default: "Todo",
    },
    customId: {
      type: String,
      unique: true,
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        return ret;
      }
    },
    toObject: { virtuals: true },
  }
);

workItemSchema.pre("save", async function (next) {
  if (this.customId) return next();
  
  const count = await mongoose.model("WorkItem").countDocuments();
  this.customId = `WI-${String(count + 1).padStart(3, "0")}`;
  next();
});

const WorkItem = mongoose.model("WorkItem", workItemSchema);
module.exports = WorkItem;
