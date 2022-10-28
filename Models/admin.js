const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  name: String,
  password: String,
  date: { type: Date, default: Date.now },
});

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;
