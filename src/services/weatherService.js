const { AppError } = require('../errors');
const createZipCodeService = require('./zipCodeService');
const fetchWithTimeout = require('./fetchWithTimeout');

const SCALE_LABELS = {
  fahrenheit: 'Fahrenheit',
  celsius: 'Celsius'
};

function normalizeScale(scale) {
  if (!scale) {
    return SCALE_LABELS.fahrenheit;
  }

  const normalizedScale = SCALE_LABELS[String(scale).trim().toLowerCase()];

  if (normalizedScale) {
    return normalizedScale;
  }

  throw new AppError('scale must be either Fahrenheit or Celsius', 400);
}

function createWeatherService({
  fetchImpl = fetch,
  zipCodeService = createZipCodeService(fetchImpl)
} = {}) {
  async function getTemperatureByZip(zipCode, scale) {
    const normalizedScale = normalizeScale(scale);
    const { latitude, longitude } =
      await zipCodeService.getCoordinatesByZipCode(zipCode);

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('current', 'temperature_2m');
    url.searchParams.set('temperature_unit', normalizedScale.toLowerCase());

    const response = await fetchWithTimeout(
      fetchImpl,
      url,
      'failed to fetch weather data'
    );

    if (!response.ok) {
      throw new AppError('failed to fetch weather data', 502);
    }

    const data = await response.json();
    const temperature = data?.current?.temperature_2m;

    if (typeof temperature !== 'number') {
      throw new AppError('weather data is mising the current temperature', 502);
    }

    return {
      temperature: Math.round(temperature),
      scale: normalizedScale
    };
  }

  return { getTemperatureByZip };
}

module.exports = createWeatherService;
module.exports.normalizeScale = normalizeScale;