This project involved a lot of concepts and I had fun learning a lot while solving the problem statement. It took some time to figure out the most optimal code which can be used in production and can be easily understood by anyone who wants to update it. 

So, this is a Node.js and Express API that returns the current temperature for a given US zip code.
It supports one route:

The API application provides one route:
GET /locations/:zipCode

By default, the temperature is returned in Fahrenheit. Users can also pass scale=Celsius or scale=Fahrenheit in the query string.

Example requests

Default Fahrenheit:
GET /locations/24060

Example response:
{
"temperature": 43,
"scale": "Fahrenheit"
}

Celsius:
GET /locations/90210?scale=Celsius

Example response:
{
"temperature": 25,
"scale": "Celsius"
}

Invalid ZIP code:
GET /locations/24A60

Example response:
{
"error": "ZIP code must be 5 digits"
}

Invalid scale:
GET /locations/24060?scale=Kelvin

Example response:
{
"error": "Scale must be Fahrenheit or Celsius"
}

Tech stack

Node.js
Express
Supertest
Node built-in test runner

External APIs used were:

This project uses two external APIs.

*AI was used to select these two external APIs*

Zippopotam.us
Used to convert a US ZIP code into latitude and longitude.

Open-Meteo
Used to get the current temperature for those coordinates.

The flow is:

ZIP code to latitude and longitude to current temperature

Project structure:

src (source)
app.js
index.js
errors.js
services
zipCodeService.js
weatherService.js

tests
locations.test.js

How the project works

So, index.js is the entry point. It starts the Express server on port 8080.

app.js contains the API route and error handling. It receives the ZIP code and optional scale, calls the weather service, and returns the final JSON response.

errors.js contains a small custom error class that lets the app return proper status codes like 400 and 502.

zipCodeService.js file checks whether the ZIP code is valid and then calls the ZIP lookup API. It returns latitude and longitude.

weatherService.js file basically checks the scale, calls the weather API using the coordinates from the ZIP code service, and returns the temperature with the correct scale label.

locations.test.js file is used to test route behvior using mocked fetch responses so the test do not respond on live API calls.

Design choices and why I kept it this way

This was a design choice to make sure that this remains readable and can be edited based on requirements later on. This is something which was an issue in my ex team in Goldman sometimes and I was always instructed to make the code as if a novice reads and understands the same.

My main decisions were:

Use plain JavaScript instead of TypeScript to keep setup lighter. Keep a small file structure instead of splitting into too many layers.
Separate ZIP lookup and weather lookup so each file has one clear job and Keep the route logic simple while moving API related work into service files.
The focus was to write only the tests that matter for the final output. 

I avoided adding extra abstractions that were not needed for one route.

My methodology:

I built this in small steps.

Step 1
Set up a Node.js project with Express and made sure the server runs on localhost:8080.

then in Step 2
Created the route:
GET /locations/:zipCode

Step 3
Added ZIP code validation so invalid input returns a 400 response.

next Step 4
Used a ZIP code API to get latitude and longitude.

Step 5
Used a weather API to get the current temperature from those coordinates.

Step 6
Added support for the optional scale query parameter.

Step 7
Added tests for the main cases:
default Fahrenheit response
Celsius response
invalid ZIP code
invalid scale

Step 8
Cleaned up the structure and simplified parts that felt overbuilt for a small assignment.

*Problems I faced and how I solved them*

Node and npm version issue
At first, npm install failed because I was using a newer Node and npm version combination that caused install problems.
My solution:
I switched to Node 20 using nvm, which made the install and test flow stable.

Overbuilt structure
My earlier version had more layers and helper patterns than this small assignment really needed. It worked, but it felt too polished for one route.
My solution:
I simplified the structure, removed unnecessary patterns, shortened the tests, and used more direct exports.

Export mismatch
At one point, the app expected weatherService.getTemperatureByZip, but the service file was still exporting an older structure.
My Solution:
I aligned all files to use the same simpler export style.

Test file issues
A test file change caused a syntax error because the file ended before the last assertion block was completed.
My SOlution:
I replaced the file with a shorter clean version and re-ran the tests.

Live API dependency during testing
Calling live APIs inside tests would make tests slow and unreliable.
My Solution:
I mocked global.fetch in the test file so the tests only check my own API behavior.

*Where AI helped me*

Honestly, AI was helpful as a coding assistant. It helped me mainly in these areas:

Refactoring and simplification:
I used AI to review parts of the project that felt too long or too formal and then simplify them. So, this was very important to keep the production ease part going and at points i felt that i might be including extra code or data which is isn't needed such as more tests. AI helped reduce that.

This mainly affected:
src/app.js
src/services/zipCodeService.js
src/services/weatherService.js
tests/locations.test.js

Debugging:
AI helped me understand and fix specific errors such as:
Node and npm version issues
export and import mismatches
test file syntax errors
route test failures caused by wrong module structure
Node.js was easy to adapt to since I had some experience with it however AI was helpful to fix those annoying syntax errors. 

API selection guidance:
AI helped compare and choose simple free APIs that fit the assignment well. This was used in the two APIs as mentioned earlier. 

This mainly affected:
choosing Zippopotam.us for ZIP lookup
choosing Open-Meteo for weather data

So, overall it was helpful as a support base to kinda rectify the nuances and syntax errors.
I still had to:
understand the route requirements
run the project locally
fix broken code after changes
keep the files consistent
test the final behavior
decide what structure felt natural and what should be removed

*How to run the project*

Install dependencies:
npm install

Run tests:
npm test

Start the server:
npm start

The app runs at:
http://localhost:8080

Final notes

If I were extending it further, I would probably add:
stronger API failure handling
request logging
environment based config
more test coverage for API failure cases

For the current scope, I kept it focused on correctness and readability while gettin the corect output. 