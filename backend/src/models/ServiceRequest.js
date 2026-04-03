const mongoose = require("mongoose");

const SERVICE_TYPES = ["Website", "Marketing", "Branding"];
const REQUEST_STATUSES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

const serviceRequestSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    serviceType: {
      type: String,
      enum: SERVICE_TYPES,
      required: [true, "Service type is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    preferredDeadline: {
      type: Date,
      required: [true, "Preferred deadline is required"],
    },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "Draft",
    },
    reviewNote: {
      type: String,
      trim: true,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customId: {
      type: String,
      unique: true,
    },
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

serviceRequestSchema.pre("save", async function (next) {
  if (this.customId) return next();
  
  const count = await mongoose.model("ServiceRequest").countDocuments();
  this.customId = `SR-${String(count + 1).padStart(3, "0")}`;
  next();
});

serviceRequestSchema.virtual("workItems", {
  ref: "WorkItem",
  localField: "_id",
  foreignField: "requestId",
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
module.exports = ServiceRequest;
