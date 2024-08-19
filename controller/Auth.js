const { User } = require("../model/User");
const crypto = require("crypto"); // for password hashing
const { sanitizeUser } = require("../services/common"); // for sanitizing user data before sending to client
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    // Generate a random salt for password hashing
    const salt = crypto.randomBytes(16);

    // Hash the user's password using pbkdf2 with the generated salt
    crypto.pbkdf2(
      req.body.password, // Password from the request body
      salt, // Salt generated above
      310000, // No. of iterations
      32, // Key length
      "sha256", // Digest algorithm
      async function (err, hashedPassword) {
        // Create a new User instance with the hashed password and salt
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save(); // Save the user to the database

        // Log in the user, adding their info to the session
        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            // If an error occurs during login, return a 400 status with the error
            res.status(400).json(err);
          } else {
            // Create a JWT token for the user
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);

            // Set the JWT token in an HTTP-only cookie and respond with the token
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000), // Token expires in 1 hour
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
              })
              .status(201) // Respond with a 201 status indicating resource creation
              .json(token); // Send the token as JSON in the response
          }
        });
      }
    );
  } catch (err) {
    // If an error occurs during user creation, return a 400 status with the error
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  // Log in the user by setting the JWT token in an HTTP-only cookie
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000), // Token expires in 1 hour
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    })
    .status(201) // Respond with a 201 status indicating successful login
    .json(req.user.token); // Send the token as JSON in the response
};

exports.checkUser = async (req, res) => {
  // Check if the user is authenticated and respond with their information
  res.json({ status: "success", user: req.user });
};
