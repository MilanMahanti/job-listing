const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User require a name."],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Enter a valid email"],
    required: [true, "Email cant be empty"],
    unique: true,
  },
  mobile: {
    type: String,
    required: [true, "User need to provide a phone no."],
  },
  password: {
    type: String,
    minLength: [6, "Password must be greater than 6 characters"],
    required: [true, "Password can not be empty."],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
