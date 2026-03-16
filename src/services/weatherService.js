const AppError = require("../errors");
const zipCodeService = require("./zipCodeService");

function normalizeScale(scale) {
  if (!scale) {
    return "Fahrenheit";
  }

  const value = String(scale).trim().toLowerCase();

  if (value === "fahrenheit") {
    return "Fahrenheit";
  }

  if (value === "celsius") {
    return "Celsius";
  }

  return null;
}

async function getTemperatureByZip(zipCode, scale) {
  const finalScale = normalizeScale(scale);

  if (!finalScale) {
    throw new AppError("Scale must be Fahrenheit or Celsius", 400);
  }

  const { latitude, longitude } = await zipCodeService.getCoordinatesByZip(zipCode);
  const unit = finalScale === "Celsius" ? "celsius" : "fahrenheit";

  let response;

  try {
    response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=${unit}`
    );
  } catch (error) {
    throw new AppError("Could not get weather data", 502);
  }

  if (!response.ok) {
    throw new AppError("Could not get weather data", 502);
  }

  const data = await response.json();
  const temperature = data.current && data.current.temperature_2m;

  if (typeof temperature !== "number") {
    throw new AppError("Weather data is mising temperature", 502);
  }

  return {
    temperature,
    scale: finalScale
  };
}

module.exports = {
  getTemperatureByZip
};