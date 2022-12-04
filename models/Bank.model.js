import mongoose from "mongoose";
const { Schema } = mongoose;

const bankSchema = new Schema({
  nameBank: {
    type: String,
    required: true,
  },
  nomorRekening: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
