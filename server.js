const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//$env:NODE_ENV = "development"; node server.js
//command to ser environment variable.
// console.log(process.env);

app.listen(process.env.PORT || 3000, () => {
  console.log('server is running');
});
