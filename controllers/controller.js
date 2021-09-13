// controllers/controller.js

// Handles the business Logic
const bootcampModel = require("../models/model");

const controller = {
  getAllCourses: async () => await bootcampModel.getCourses()
};

module.exports = controller;