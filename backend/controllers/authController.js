const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generates a JSON Web Token for the given user.
 *
 * The token contains the user’s ID and expires in 7 days by default. The
 * expiration can be adjusted as needed. Using a separate helper function
 * for signing tokens keeps the controller functions clean and makes it
 * easier to change the token generation logic centrally.
 *
 * @param {ObjectId} id The MongoDB ObjectId of the user.
 * @returns {string} A signed JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Registers a new user.
 *
 * This handler expects a JSON body with `username`, `email`, and `password`.
 * It ensures the email is unique before creating the user. On success,
 * a JWT is returned along with the newly created user’s public data. Any
 * validation or server errors result in appropriate HTTP responses.
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Authenticates an existing user and returns a token.
 *
 * This handler expects a JSON body with `email` and `password`. It verifies
 * that the user exists and that the provided password matches the stored
 * hash. On success, the user’s public data and a token are returned.
 * Incorrect credentials result in a 401 response.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};