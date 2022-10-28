const mongoose = require("mongoose")
const { Schema } = mongoose;


const FactSchema = new Schema({
  author: String, // String is shorthand for {type: String}
  title:  String,
  imageUrl: {
    data:Buffer,
    contentType: String
  },
  category: String,
  desc: String,
  date: { type: Date, default: Date.now },
});

const Fact = mongoose.model('facts', FactSchema);
module.exports = Fact;


