const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USER_JWT_SECRET, JWT_EXPIRE } = require("../Config/config");
const User = require("../Model/userModel");
const { validateEmail, validatePassword } = require("../Utils/validators");

// User registration

const register = async (username, email, password, phone, address, pincode) => {
  validateEmail(email);
  validatePassword(password);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const newUser = new User({
    username,
    email,
    password,
    phone,
    address,
    pincode,
    role: "user",
  });

  // Save the user to the database
  await newUser.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser._id, role: newUser.role },
    USER_JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );

  return { user: newUser, token };
};

// User login
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    USER_JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );

  return { user, token };
};

module.exports = { register, login };
