const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Employee'); // Adjust path as needed

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email and ignore the deletedAt column (paranoid: false)
    const user = await User.findOne({ where: { email }, paranoid: false });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Log invalid password attempts
      console.log(`Invalid login attempt for email: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token with the user's ID
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the response with the token
    return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging

    // Differentiate between server errors and known client errors
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ error: 'Database error, please try again later' });
    }

    res.status(500).json({ error: 'Error logging in, please try again later' });
  }
};
