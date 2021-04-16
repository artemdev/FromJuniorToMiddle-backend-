const app = require('../app');
const db = require('../model/db');

require('dotenv').config();

<<<<<<< HEAD
const PORT = process.env.PORT || 4000;
=======

const PORT = process.env.PORT || 3030;
>>>>>>> 8ec4c7bc473e4d152c84be481fcb4e950cedb405


db.then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server not running. Error message: ${err.message}`);
  process.exit(1);
});
