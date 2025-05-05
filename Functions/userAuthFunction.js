const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel'); // adjust the path as needed
const { USER_JWT_SECRET } = require('../Config/config');

const registerUser = async (data) => {
  const { username, email, password } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return { message: "Registration successful", user: newUser };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.userNumber }, USER_JWT_SECRET, { expiresIn: '7d' });

  return {
    message: "Login successful",
    token,
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      userNumber: user.userNumber
    }
  };
};

const checkAddress = async (userNumber) => {
  const user = await User.findOne({ userNumber });

  if (!user) throw new Error("User not found");

  const missingFields = [];

  if (!user.address) missingFields.push('address');
  if (!user.phone) missingFields.push('phone');
  if (!user.pincode) missingFields.push('pincode');

  return {
    message: missingFields.length === 0
      ? "All address fields are present"
      : "address fields are missing",
    missingFields
  };
};

const updateAddress = async (userNumber, data) => {
  const user = await User.findOneAndUpdate(
    { userNumber },
    {
      $set: {
        address: data.address,
        phone: data.phone,
        pincode: data.pincode
      }
    },
    { new: true }
  );

  if (!user) throw new Error("User not found");

  return { message: "Address updated successfully", user };
};

module.exports = {
  registerUser,
  loginUser,
  checkAddress,
  updateAddress
};
