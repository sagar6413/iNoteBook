const mongoose = require("mongoose"); // importing mongoose module

const mongoURI =
  "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false"; //Connecting to database using mongoose module and mongoURI variable which is defined above.

const connectToMongo = () => {
  //connectToMongo function is defined above. This function will connect to the database.
  mongoose.connect(mongoURI, () => {
    console.log("MongoDB connected");
  }); //connecting to the database using mongoURI variable. This function will be called when the server starts. It will print the message "MongoDB connected" in the console. The () => {} is a callback function. It will be called when the connection is successful. It will print the message "MongoDB connected" in the console.
};

module.exports = connectToMongo; //Exporting the connectToMongo function. This will be used in index.js in app.use function.
