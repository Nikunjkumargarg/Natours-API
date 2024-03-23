const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//$env:NODE_ENV = "development"; node server.js
//command to ser environment variable.
// console.log(process.env);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('server is running');
});

//handle all unhandled rejected promised globally
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Exception!!!!!');
  server.close(() => {
    process.exit(1);
  });
});
