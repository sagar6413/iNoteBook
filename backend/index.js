//Connecting To Database
const connectToMongo = require("./db"); //connecting to database file
connectToMongo(); //calling the function to connect to database

//Connecting to server using express
const express = require("express"); //importing express module
const cors = require("cors");
const app = express(); //creating an instance of express
app.use(cors());
const port = process.env.PORT || 5000; //setting the port to 5000 or process.env.PORT. process.env.PORT is a global variable that is set by the hosting provider.

//Using Middleware to parse the body of the request
app.use(express.json()); //using express.json() to parse the body of the request  to json format

// Calling the routes
app.use("/api/auth", require("./routes/auth")); //calling the auth route
app.use("/api/notes", require("./routes/notes")); //calling the notes route

//Listning on port
app.listen(port, () => {
  //listening on port 5000 or process.env.PORT
  console.log(`iNoteBook Backend Server started on port ${port}`);
});
