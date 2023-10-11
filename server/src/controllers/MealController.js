const UserMeals = require("../models/UserMeals"); // Import the UserMeals model

const MealController = {
  // Register meals for users (Admin)
  registerMeals: async (req, res) => {
    try {
      const mealData = req.body;
      const meal = await UserMeals.create(mealData); // Use UserMeals model
      res.status(201).json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Meal registration failed" });
    }
  },

  // Get all meals (Admin and User)
  getAllMeals: async (req, res) => {
    try {
      const meals = await UserMeals.find();
      res.status(200).json(meals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  },

  // Get a meal by ID (Admin and User)
  getMealById: async (req, res) => {
    try {
      const mealId = req.params.id;
      const meal = await UserMeals.findById(mealId);
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.status(200).json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch meal" });
    }
  },

  // Update a meal (Admin)
  updateMeal: async (req, res) => {
    try {
      const mealId = req.params.id;
      const updatedMealData = req.body;
      const meal = await UserMeals.findByIdAndUpdate(mealId, updatedMealData, {
        new: true,
      });
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.status(200).json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update meal" });
    }
  },

  // Delete a meal (Admin)
  deleteMeal: async (req, res) => {
    try {
      const mealId = req.params.id;
      const meal = await UserMeals.findByIdAndDelete(mealId);
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete meal" });
    }
  },

  // Reserve meals for the next day until 6 PM (User)
  reserveMeals: async (req, res) => {
    try {
      // Implement reservation logic here
      res.status(200).json({ message: "Meals reserved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to reserve meals" });
    }
  },

  // List user's bookings and cancel bookings for the next day before 6 PM (User)
  getUserBookings: async (req, res) => {
    try {
      // Implement booking listing logic here
      res.status(200).json({ message: "User bookings retrieved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve user bookings" });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      // Implement booking cancellation logic here
      res.status(204).json({ message: "Booking canceled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  },
};

module.exports = MealController;
