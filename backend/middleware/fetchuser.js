//This is a file that contaains the middleware function that is used to verify the token.
const jwt = require("jsonwebtoken"); //importing jsonwebtoken
const JWT_SECRET = "Sagar"; //creating the jwtt secret

const fetchuser = (req, res, next) => {
  //getting the token from the header of the request
  //Header is a key value pair in the request that is sent by the client to the server. It is used to authenticate the request. The client sends the token in the header of the request.
  const token = req.header("auth-token");

  if (!token) {
    //if token is not present
    res.status(401).json({
      message: "Please authenticate using a valid token", //returning the message to the client
    });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET); //verifying the token using the jwt.verify() function. The token is verified by comparing it with the secret key. If the token is verified then the data is returned. If the token is not verified then an error is thrown. The error is caught and handled by the catch block. The error is then returned to the client.
    req.user = data.user; //setting the user to the request object so that it can be used in the next middleware function or route handler.
    next(); //calling the next middleware function or route handler to continue the request. It is used to move to the next middleware or route handler. Middleware functions are called in the order that they are defined in the file. It is important to call next() after the middleware function because the next middleware function or route handler is called only if the middleware function is successful.
  } catch (error) {
    //catching the error
    res.status(401).json({
      message: "Please authenticate using a valid token", //returning the message to the client.
    });
  }
};

module.exports = fetchuser; //exporting the middleware function
