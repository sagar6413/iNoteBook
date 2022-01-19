//Connecting To Database
const connectToMongo = require("./db");
connectToMongo();

//Connecting to server using express
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//Sending HelloWorld on localhost/
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

//Listning on port
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
