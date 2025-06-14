const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // filepath: c:\Users\PRINCE SINGH\OneDrive\Documents\Desktop\Dev\Projects\DevTinder\src\models\user.js
const jwt = require("jsonwebtoken"); // filepath: c:\Users\PRINCE SINGH\OneDrive\Documents\Desktop\Dev\Projects\DevTinder\src\models\user.js
const validator = require("validator"); // filepath: c:\Users\PRINCE SINGH\OneDrive\Documents\Desktop\Dev\Projects\DevTinder\src\models\user.js
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Anonymous",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("kya be ! Invalid email format");
          res.send("Invalid email format");
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    newpassword: {
      type: String,
      default: "No new password set",
      validate(value) {
        if (value.length < 6) {
          throw new Error("New password must be at least 6 characters long");
        }
      },
    },
    bio: {
      type: String,
      default: "No bio available",
      validate(value) {
        if (value.length > 20) {
          throw new Error("Bio cannot exceed 200 characters");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ email: user.email }, "mysecretkey", {
    expiresIn: "10m",
  });
  return token;
};

userSchema.methods.validatekrobhai = async function (passwordInput) {
  const user = this;
  return await bcrypt.compare(passwordInput, user.password);
};

module.exports = mongoose.model("USER", userSchema);
