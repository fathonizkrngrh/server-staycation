const mongoose = require("mongoose");
const { Schema } = mongoose;
const { hashPassword } = require("../utils/bcrypt.utils");

const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

usersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    await hashPassword(user.password);
  }
});

module.exports = mongoose.model("Users", usersSchema);
