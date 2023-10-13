const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { validationResult } = require("express-validator");
const {
  userValidationRules,
  validateUserData,
} = require("../middlewares/validationMiddleware");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

// Get all users (Admin) ✔
router.get("/users", isLoggedIn, isAdmin, UserController.getAllUsers);

// Get a user by ID (Admin) ✔
router.get("/users/:id", isLoggedIn, isAdmin, UserController.getUserById);

// Create a new user (Admin) ✔
router.post(
  "/users",
  isLoggedIn,
  isAdmin,
  userValidationRules,
  validateUserData,
  UserController.createUser
);

// refresh token
// router.get("/users/refresh-token", refreshToken);

// Update a user (Admin) (Half Done)
// password hash kore update kora lagbe,
// also image er byparta fix kora lagbe,
// and also mobile number update korar age check kore nite hobe notun dewa number onno kon user er details e ache kina
router.put("/users", isLoggedIn, isAdmin, UserController.updateUser);

// Forget Password (For all) // problem not hitting properly in put method
router.put("/users/forget-password", UserController.forgetPassword);

// Update user's own info (User) (Half Done)
// password hash kore update kora lagbe,
// also image er byparta fix kora lagbe,
// and also mobile number update korar age check kore nite hobe,
// notun dewa number onno kon user er details e ache kina
router.put("/users/:id", isLoggedIn, UserController.updateUserOwnInfo);

// Delete a user (Admin) ✔
router.delete("/users", isLoggedIn, isAdmin, UserController.deleteUser);

module.exports = router;
