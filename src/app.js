const express = require("express");
require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const { auth } = require("./Middlewares/auth"); // Importing the auth middleware

const app = express();
const connectDB = require("./config/database");
const bcrypt = require("bcrypt"); // For hashing passwords

const User = require("./models/user");

app.use(express.json());
// Middleware to parse JSON request bodies
app.use(cookieParser());

const authrouter = require("./routes/authRouter");
const userrouter = require("./routes/userRouter");
const connectionrequestrouter = require("./routes/connectionrequestRouter");
const profilerouter = require("./routes/profileRouter");

app.use("/", authrouter);
app.use("/", userrouter);
app.use("/", connectionrequestrouter);
app.use("/", profilerouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
