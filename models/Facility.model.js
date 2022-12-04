import mongoose from "mongoose";
const { Schema } = mongoose;

const facilitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Facility", facilitySchema);
