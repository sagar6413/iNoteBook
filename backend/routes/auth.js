const express = require("express"); //Importing express
const User = require("../models/user"); //Importing the "user" model
const { body, validationResult } = require("express-validator"); //Using express-validator for validation purposes

//creating a router which is being called in index.js in app.use function
const router = express.Router(); //Creating a router

// Create a user using: POST "/api/auth/createuser" -> Here we will create user. This doesn't require any authentication.
//This is the route that will be called when we make a post request to /api/auth/
//This route will be used to create a user in the database using the "user" model and the "User" model is imported above in this file.
router.post(
  "/createuser",
  //Using express-validator for validation purposes. The below array contains validations that we want to do on the request body.
  [
    //Using express-validator to validate the name field.
    body("name", "Total  letters in name must be >= 3").isLength({
      min: 3,
    }),
    //
    //Using express-validator to validate the email field.
    body("email", "Please Enter A Valid Email").isEmail(),
    //
    //Using express-validator to validate the password field.
    body(
      "password",
      "Password must be at least 5 characters and less than 20 characters"
    ).isLength({ min: 5, max: 20 }),
  ],
  async (req, res) => {
    //This is the callback function that will be called after the validations are done.
    //If the validations are successful, then the user will be created. If not, then the above mentioned errors will be returned.

    const errors = validationResult(req); //This is the result of the validations.
    //If there are errors, we will send the errors as a response.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //If there are errors, we will send the errors as a response.
    }

    try {
      //This is the try block. If server works finne Try block will be executed. Otherwise we will catch the error in catch block and send the server error as a response.
      //
      //
      //Check whether the user with the same email already exists in the database. If the user exists, then we will send an error response.
      let user = await User.findOne({ email: req.body.email }); // findOne is a mongoose method that will return a user if the user exists.
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists with same email" }],
        });
      }
      //
      //
      //If there are no errors, we will create a new user. We will use the body of the request to create a new user. We will use the User model to create a new user.
      //
      //
      //Creating a new user using the User model(schema). We will use the body of the request to create a new user.
      //The user will be created using the "create" method of the User model.
      //The "create" method will return a promise. We will use await to wait for the promise to resolve.
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      res.json(user); //If the user is created successfully, we will send the user as a response.
    } catch (err) {
      //If there is an error, we will send the error as a response.
      console.error(err.message);
      res.status(500).send("Server Error"); //If there is an error, we will send the error as a response. We will send a 500 status code. This is a server error.
    }
  }
);

module.exports = router; //Exporting the router. This will be used in index.js in app.use function.
