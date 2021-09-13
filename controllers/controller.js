// controllers/controller.js

// Handles the business Logic
const model = require("../models/model");

const controller = {
  getDatabaseEntries: async () => await model.getDatabaseEntries(),
  getProgrammingPage: async () => await model.getProgrammingPage()
};

module.exports = controller;