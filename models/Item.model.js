const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "Indonesia",
  },
  city: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: ObjectId,
    ref: "Category",
  },
  imageId: [{ type: ObjectId, ref: "Image" }],
  facilityId: [{ type: ObjectId, ref: "Fasility" }],
  activityId: {
    type: ObjectId,
    ref: "Activity",
  },
});

module.exports = mongoose.model("Item", itemSchema);
