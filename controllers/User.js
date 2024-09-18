const userModel = require("../models/user.model");
const { validateUser } = require("../validation/validation");
const { forgotPasswordSchema } = require("../validation/validation");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");
const sendEmail = require("../helper/sendEmail");
dotenv.config();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({
      message: "All users",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    // Validate user input
    const { error } = validateUser.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if the user already exists
    const isExist = await userModel.findOne({ email: req.body.email });
    if (isExist) {
      return res.status(404).json({ message: "Email already exists" });
    }
    // hash the password
    const hash = await bcryptjs.hash(req.body.password, 10);

    // create a new user
    const user = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    user.password = undefined;
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// refresh token

// login user
const loginUser = async (req, res, next) => {
  try {
    // Validate user input
    const { error } = validateUser.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if the user exists
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // compare the password
    const isValid = await bcryptjs.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    // create a token
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
    console.log("Token ", token);
    // send the response
    user.password = undefined;
    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// forgot password
const forgotPassword = async (req, res, next) => {
  try {
    // Validate user input
    const { error } = forgotPasswordSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // check if the user exists
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // send the email
    const email = req.body.email;
    const url = `http://localhost:3000/reset-password/${user._id}`;
    await sendEmail(email, url);
    return res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// logout user
const logoutUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not Exits" });
    }
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  forgotPassword,
  logoutUser,
};
