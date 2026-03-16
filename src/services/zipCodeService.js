const AppError = require("../errors");

function isFiveDigitZip(zipCode) {
  return (
    typeof zipCode === "string" &&
    zipCode.length === 5 &&
    zipCode.split("").every((char) => char >= "0" && char <= "9")
  );
}

async function getCoordinatesByZip(zipCode) {
  if (!isFiveDigitZip(zipCode)) {
    throw new AppError("ZIP code must be 5 diits", 400);
  }

  let response;

  try {
    response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
  } catch (error) {
    throw new AppError("Could not look up ZIP code", 502);
  }

  if (response.status === 404) {
    throw new AppError("ZIP code not found", 400);
  }

  if (!response.ok) {
    throw new AppError("Could not look up ZIP code", 502);
  }

  const data = await response.json();
  const place = data.places && data.places[0];

  if (!place) {
    throw new AppError("ZIP code not found", 400);
  }

  return {
    latitude: Number(place.latitude),
    longitude: Number(place.longitude)
  };
}

module.exports = {
  getCoordinatesByZip
};