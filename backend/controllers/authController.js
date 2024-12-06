const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Employee');

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {

    const user = await User.findOne({ where: { email }, paranoid: false });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {

      console.log(`Invalid login attempt for email: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'Login successful', token, user });

  } catch (error) {
    console.error('Login error:', error);


    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ error: 'Database error, please try again later' });
    }

    res.status(500).json({ error: 'Error logging in, please try again later' });
  }
};
