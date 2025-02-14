const mongoose = require('mongoose');
const app = require('./app');
const { createFolderIsNotExist } = require('./config/createFolder');
const { uploadDir, storeImage } = require('./config/upload');

require('dotenv').config();

mongoose.set('strictQuery', true);
const PORT = process.env.PORT || 3000;
const uriDb = process.env.MONGO_URI;

const connection = mongoose.connect(uriDb, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
});

connection
   .then(() => {
      app.listen(PORT, async () => {
         await createFolderIsNotExist(uploadDir);
         await createFolderIsNotExist(storeImage);

         console.log(`Database connection successful. Use our API on port: ${PORT}`);
      });
   })
   .catch(err => {
      console.log(`Server not running. Error message: ${err.message}`);
         process.exit(1);
   }
  );