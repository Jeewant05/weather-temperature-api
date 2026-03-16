const express = require("express");
const weatherService = require("./services/weatherService");
const AppError = require("./errors");

const app = express();

app.get("/locations/:zipCode", async (req, res) => {
  try {
    const { zipCode } = req.params;
    const { scale } = req.query;

    const result = await weatherService.getTemperatureByZip(zipCode, scale);
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = app;