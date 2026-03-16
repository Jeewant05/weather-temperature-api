const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

const originalFetch = global.fetch;

function mockFetch(responses) {
  let index = 0;

  global.fetch = async () => {
    const response = responses[index++];
    return {
      ok: response.ok ?? true,
      status: response.status ?? 200,
      json: async () => response.body
    };
  };
}

afterEach(() => {
  global.fetch = originalFetch;
});

test("returns Fahrenheit by default", async () => {
  mockFetch([
    {
      body: {
        places: [{ latitude: "37.2296", longitude: "-80.4139" }]
      }
    },
    {
      body: {
        current: { temperature_2m: 43 }
      }
    }
  ]);

  const response = await request(app).get("/locations/24060");

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    temperature: 43,
    scale: "Fahrenheit"
  });
});

test("returns Celsius when asked", async () => {
  mockFetch([
    {
      body: {
        places: [{ latitude: "34.0901", longitude: "-118.4065" }]
      }
    },
    {
      body: {
        current: { temperature_2m: 25 }
      }
    }
  ]);

  const response = await request(app).get("/locations/90210?scale=Celsius");

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    temperature: 25,
    scale: "Celsius"
  });
});

test("returns 400 for a bad ZIP code", async () => {
  const response = await request(app).get("/locations/24A60");

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: "ZIP code must be 5 digits"
  });
});

test("returns 400 for a bad scale", async () => {
  const response = await request(app).get("/locations/24060?scale=Kelvin");

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: "Scale must be Fahrenheit or Celsius"
  });
});