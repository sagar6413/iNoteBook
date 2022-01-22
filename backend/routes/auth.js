const express = require("express"); //Importing express
const User = require("../models/user"); //Importing the "user" model
const { body, validationResult } = require("express-validator"); //Using express-validator for validation purposes

const fetchuser = require("../middleware/fetchuser"); //Importing the "fetchuser" middleware

const bcrypt = require("bcryptjs"); //Importing bcryptjs for password hashing and salting purposes

const jwt = require("jsonwebtoken"); //Importing jsonwebtoken for creating and verifying tokensn for authentication purposes

const JWT_SECRET = "Sagar"; //Defining a secret key for creating and verifying tokens for authentication purposes using jsonwebtoken module and assigning it to the JWT_SECRET variable. This is a global variable. It will be used in the createToken and verifyToken functions.

//creating a router which is being called in index.js in app.use function
const router = express.Router(); //Creating a router

// Create a user using: POST "/api/auth/createuser" -> Here we will create user. This doesn't require any authentication.
//This is the route that will be called when we make a post request to /api/auth/
//This route will be used to create a user in the database using the "user" model and the "User" model is imported above in this file.
//Route->#1: "/api/auth/createuser"
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
    let success = false;
    //This is the callback function that will be called after the validations are done.
    //If the validations are successful, then the user will be created. If not, then the above mentioned errors will be returned.

    const errors = validationResult(req); //This is the result of the validations.
    //If there are errors, we will send the errors as a response.
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, errors: errors.array() }); //If there are errors, we will send the errors as a response.
    }

    try {
      //This is the try block. If server works finne Try block will be executed. Otherwise we will catch the error in catch block and send the server error as a response.
      //
      //
      //Check whether the user with the same email already exists in the database. If the user exists, then we will send an error response.
      let user = await User.findOne({ email: req.body.email }); // findOne is a mongoose method that will return a user if the user exists.
      if (user) {
        return res.status(400).json({
          success: success,
          errors: [{ msg: "User already exists with same email" }],
        });
      }
      //
      //
      //If there are no errors, we will create a new user. We will use the body of the request to create a new user. We will use the User model to create a new user.
      //
      //the meaning of await is that it will wait for the result of the function to be returned.
      //
      const salt = await bcrypt.genSalt(10); //This is the salt that will be used to hash the password.
      const secPassword = await bcrypt.hash(req.body.password, salt); //Using bcryptjs to hash the password. We will use the 10 as the salt.  The 10 is the number of times the hashing will be done. The higher the number, the more secure the password will be. The lower the number, the less secure the password will be.
      //
      //
      //Creating a new user using the User model(schema). We will use the body of the request to create a new user.
      //The user will be created using the "create" method of the User model.
      //The "create" method will return a promise. We will use await to wait for the promise to resolve.
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword, //This is the hashed password. We will use the bcryptjs module to hash the password. We will use the "secPassword" variable to store the hashed password.
      });

      const data = {
        //This is the data that will be sent as a response. It will contain the user that was created. It will contain the user's id and the user's name.
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET); //Here we are using jsonwebtoken to create a token. We will use the id of the user as the payload. We will use the JWT_SECRET to create the token. We will use the "jwtData" variable to store the token. The "jwtData" variable will be used to send the token as a response.
      console.log(authToken);
      success = true;
      res.json({ success, authToken }); //Sending the token as a response. This is the token that will be used for authentication purposes. This token will be sent as a response.
    } catch (err) {
      //If there is an error, we will send the error as a response.
      console.error(err.message);
      res.status(500).send("Server Error"); //If there is an error, we will send the error as a response. We will send a 500 status code. This is a server error.
    }
  }
);

//EndPoint for authenticating a user.
//This is the route that will be called when we make a post request to /api/auth/login -> Here we will authenticate the user. This requires an authentication.
//This route will be used to authenticate a user in the database using the "user" model and the "User" model is imported above in this file.
//Route->#2: "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Please Enter A Valid Email").isEmail(), //Using express-validator to validate the email field.

    body("password", "Password cannot be empty").exists(), //Using express-validator to validate the password field.
  ],
  async (req, res) => {
    let success = false;
    //This is the callback function that will be called after the validations are done. If the validations are successful, then the user will be authenticated. If not, then the above mentioned errors will be returned.
    const errors = validationResult(req); //This is the result of the validations.
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() }); //If there are errors, we will send the errors as a response.
    }
    const { email, password } = req.body; //This is the email and password which in input that will be used to authenticate the user.
    try {
      //This is the try block. If server works finne Try block will be executed. Otherwise we will catch the error in catch block and send the server error as a response.
      let user = await User.findOne({ email: email }); //findOne is a mongoose method that will return a user if the user exists. We will use the email that was sent in the request to find the user. We will use the "user" variable to store the user.
      if (!user) {
        //If the user does not exist, then we will send an error response.
        return res.status(400).json({
          success,

          errors: [{ msg: "Please try to login with correct credentials" }],
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password); //Using bcryptjs to compare the password that was sent in the request with the hashed password in the database. We will use the "passwordCompare" variable to store the result of the comparison.
      if (!passwordCompare) {
        //If the password does not match, then we will send an error response.
        return res.status(400).json({
          success,
          errors: [{ msg: "Please try to login with correct credentials" }],
        });
      }

      const data = {
        //This is the data that will be sent as a response. It will contain the user that was created. It will contain the user's id and the user's name.
        user: {
          id: user.id, //This is the id of the user. We will use this id to create a token. We will use this id to authenticate the user.
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); //here we are signing the token with the secret  that will be used to pass when the user logs in and this will help us to verify the user.
      success = true;
      res.json({ success, authToken }); //Sending the token as a response. This is the token that will be used for authentication purposes. This token will be sent as a response.
    } catch (err) {
      //If there is an error, we will send the error as a response.
      console.error(err.message);
      res.status(500).send("Server Error"); //If there is an error, we will send the error as a response. We will send a 500 status code. This is a server error.
    }
  }
);

//EndPoint for getting the user's details.
//This is the route that will be called when we make a get request to /api/auth/getuser -> Here we will get the user's details. This requires an authentication.Login.
//This route will be used to get the user's details in the database using the "user" model and the "User" model is imported above in this file.
//Route->#3: "/api/auth/getuser"
router.post(
  "/getuser",
  fetchuser, //This is the middleware function that will be called before the route. We will use this middleware function to get the user's details. We have used the "fetchuser" variable to store the middleware function in the file fetchuser. This middleware function will be called before the route. We will use the "user" variable to store the user's details. We will use the "req" variable to get the user's details. We will use the "res" variable to send the user's details as a response. We will use the "next" variable to call the next middleware function. We will use the "err" variable to store the error.

  async (req, res) => {
    try {
      //This is the try block. If server works finne Try block will be executed. Otherwise we will catch the error in catch block and send the server error as a response.
      const user = await User.findById(req.user.id).select("-password"); //Here we are using the mongoose method "findById" to get the user's details. We will use the "user" variable to store the user's details. We will use the "req.user.id" variable to get the user's id. We will use the "select" method to get the user's details. We will use the "-password" field to exclude the password from the response.
      res.send(user); //Sending the user's details as a response.
    } catch (err) {
      //If there is an error, we will send the error as a response.
      console.error(err.message);
      res.status(500).send("Server Error"); //If there is an error, we will send the error as a response. We will send a 500 status code. This is a server error.
    }
  }
);

module.exports = router; //Exporting the router. This will be used in index.js in app.use function.
