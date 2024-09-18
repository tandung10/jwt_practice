const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");

router.get("/", userController.getAllUsers);

router.post("/register", userController.createUser);

router.post("/refresh-token", (req, res, next) => {
  res.send("Refresh token");
});

router.post("/login", userController.loginUser);

router.post("/forgot-password", userController.forgotPassword);

router.post("/logout", userController.logoutUser);

module.exports = router;
