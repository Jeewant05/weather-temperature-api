const createApp = require('./app');

const app = createApp();
const port = Number(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`Weather API available on http://localhost:${port}`);
});

