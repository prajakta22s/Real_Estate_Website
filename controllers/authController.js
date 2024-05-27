const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registration
const registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, userType, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, phoneNumber, userType, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).send({ error: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email); // Debugging log
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for user:', email); // Debugging log
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error); // Debugging log
    res.status(500).send({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
