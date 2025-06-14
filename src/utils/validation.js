const validator = require("validator");
const { findOne } = require("../models/user");
const User = require("../models/user");
const validateSignupData = (req) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("All fields are required: name, email, and password.");
  }

  if (!validator.isEmail(req.body.email)) {
    throw new Error("kya be ! Invalid email format");
    res.send("Invalid email format");
  }
};

const validateEditprofile = (edituser) => {
  const { name, email, password } = edituser;
  const allowedFields = ["name", "email", "password", "bio", "newpassword"];

  Object.keys(edituser).forEach((key) => {
    if (!allowedFields.includes(key)) {
      throw new Error(
        `Invalid field: ${key}. Allowed fields are: ${allowedFields.join(", ")}`
      );
    }
  });

  if (!name && !email && !password) {
    throw new Error(
      "At least one field is required to update: name, email, or password."
    );
  }

  if (email && !validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (password && password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  return true;
};

const validateNewPassword = (newpassword) => {
  if (typeof newpassword !== "string" || newpassword.length < 6) {
    return false;
  }
  return true;
};

module.exports = {
  validateSignupData,
  validateEditprofile,
  validateNewPassword,
};
