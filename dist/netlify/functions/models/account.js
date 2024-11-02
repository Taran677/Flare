const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 8,
  },
  birthday: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date(); // Ensure birthday is not in the future
      },
      message: "Birthday cannot be in the future!",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
