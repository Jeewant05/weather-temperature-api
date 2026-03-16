const express = require('express');
const createWeatherService = require('./services/weatherService');
const { AppError } = require('./errors');

function createApp(weatherService = createWeatherService()) {
  const app = express();

  app.get('/locations/:zipCode', async (req, res, next) => {
    try {
      const { zipCode } = req.params;
      const { scale } = req.query;

      const result = await weatherService.getTemperatureByZip(zipCode, scale);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.use((error, req, res, next) => {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message
      });
    }

    console.error(error);
    res.status(500).json({
      error: 'internal server error'
    });
  });

  return app;
}

module.exports = createApp;