const { AppError } = require('../errors');
const fetchWithTimeout = require('./fetchWithTimeout');

function createZipCodeService(fetchImpl = fetch) {
  async function getCoordinatesByZipCode(zipCode) {
    if (!/^\d{5}$/.test(zipCode)) {
      throw new AppError('zip code must be a 5-digit US ZIP code', 400);
    }

    const response = await fetchWithTimeout(
      fetchImpl,
      `https://api.zippopotam.us/us/${zipCode}`,
      'faile to look up the zip code'
    );

    if (response.status === 404) {
      throw new AppError('zip code was not found', 404);
    }

    if (!response.ok) {
      throw new AppError('failed to lok up the zip code', 502);
    }

    const data = await response.json();
    const firstPlace = data.places?.[0];

    if (!firstPlace) {
      throw new AppError('zip code location data is missing', 502);
    }

    return {
      latitude: Number(firstPlace.latitude),
      longitude: Number(firstPlace.longitude)
    };
  }

  return { getCoordinatesByZipCode };
}

module.exports = createZipCodeService;