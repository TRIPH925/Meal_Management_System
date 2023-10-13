const path = require("path");
const fs = require("fs");
const User = require("../models/user"); // Import the User model
const { hashPassword } = require("../utils/passwordUtils");

const UserController = {
  // Get all users (accessible by admin)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Exclude the 'password' field
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  },

  // Get a user by ID (accessible admin)
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Omit the password field from the user object
      const { password, ...userWithoutPassword } = user.toObject();

      res.json(userWithoutPassword);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  },

  // Create a new user (accessible by admin)
  createUser: async (req, res) => {
    try {
      // Checking if the email or mobile number already exists in the database
      const { email, mobile } = req.body;

      if (await User.exists({ $or: [{ email }, { mobile }] })) {
        return res
          .status(400)
          .json({ error: "Email or mobile number is already in use" });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;

      // Create a new user in the database
      const newUser = await User.create(req.body);

      // Specify the absolute path for the "public" folder
      const publicPath = path.join(__dirname, "../../public");

      // Create a directory with the user's ObjectId for storing uploads
      const userId = newUser._id;
      const uploadDir = path.join(publicPath, "uploads", userId.toString());

      if (req.files && req.files.photo) {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Handle file upload (if an image is uploaded)

        const photo = req.files.photo;

        // Move the uploaded image to the user's folder
        const photoPath = path.join(uploadDir, "profile.jpg");

        photo.mv(photoPath, (err) => {
          if (err) {
            console.error("Error uploading profile picture: ", err);
          }
        });

        newUser.photo = `/uploads/${userId.toString()}/profile.jpg`;
        // newUser.photo = "profile.jpg";
        await newUser.save();
      }

      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  },

  // Update a user (accessible by admin)
  updateUser: async (req, res) => {
    try {
      const id = req.params.userId;
      const updatedUser = req.body;
      delete updatedUser.userId;

      // Check if the user wants to update the password
      if (updatedUser.password) {
        // Hash the new password before storing it in the database
        const hashedPassword = await hashPassword(updatedUser.password);
        updatedUser.password = hashedPassword;
      }

      // Check if the user wants to update the image
      if (req.files && req.files.photo) {
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Specify the absolute path for the "public" folder
        const publicPath = path.join(__dirname, "../../public");

        // Create a directory with the user's ObjectId for storing uploads
        const userId = user._id;
        const uploadDir = path.join(publicPath, "uploads", userId.toString());

        // Check if the user directory and the previous image exist
        if (fs.existsSync(uploadDir)) {
          const previousImagePath = path.join(uploadDir, "profile.jpg");

          if (fs.existsSync(previousImagePath)) {
            // Delete the previous image
            fs.unlinkSync(previousImagePath);
          }
        }

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Handle file upload (if a new image is uploaded)
        const photo = req.files.photo;

        // Move the uploaded image to the user's folder
        const photoPath = path.join(uploadDir, "profile.jpg");

        photo.mv(photoPath, (err) => {
          if (err) {
            console.error("Error uploading profile picture: ", err);
          }
        });

        updatedUser.photo = `/uploads/${userId.toString()}/profile.jpg`;
      }

      // Check if the user wants to update the email or mobile number
      const existingUserWithEmail = await User.findOne({
        _id: { $ne: id }, // Exclude the current user
        email: updatedUser.email,
      });

      const existingUserWithMobile = await User.findOne({
        _id: { $ne: id }, // Exclude the current user
        mobile: updatedUser.mobile,
      });

      if (existingUserWithEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }

      if (existingUserWithMobile) {
        return res.status(400).json({ error: "Mobile already in use" });
      }

      // Update the user in the database
      const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  },

  // Update a user (accessible by user)
  updateUserOwnInfo: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedUser = req.body;

      // password hash kore update kora lagbe

      const user = await User.findByIdAndUpdate(id, updatedUser, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  },

  forgetPassword: async (req, res) => {
    // mobile number deiye check hobe user exist kore kina then password update hobe

    res.status(200).json({ message: "forget password" });
  },

  // Delete a user (accessible by admin)
  deleteUser: async (req, res) => {
    try {
      const id = req.body.userId;

      const user = await User.findByIdAndRemove(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user" });
    }
  },
};

module.exports = UserController;
