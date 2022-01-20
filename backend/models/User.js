const mongoose = require("mongoose"); // importing mongoose module
const { Schema } = mongoose; //using mongoose.Schema to create a schema for the database and assigning it to the Schema variable. This is a mongoose method.

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
