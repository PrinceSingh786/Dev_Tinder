const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  console.log("Authentication middleware called");
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token not found");
    }
    const decodedtoken = await jwt.verify(token, "mysecretkey");
    console.log("Decoded token:", decodedtoken);
    if (!decodedtoken) {
      throw new Error("Invalid token");
    }
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email }); // Await here!
    console.log("User found:", user);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    console.log("User authenticated successfully:", user.name);
    next();
  } catch (err) {
    res.status(401).send("Authentication failed: " + err.message);
  }
};

module.exports = {
  auth,
};
