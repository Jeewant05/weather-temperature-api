const { AppError } = require('../errors');

async function fetchWithTimeout(fetchImpl, url, errorMessage) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    return await fetchImpl(url, { signal: controller.signal });
  } catch (error) {
    throw new AppError(errorMessage, 502);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = fetchWithTimeout;