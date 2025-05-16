const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel'); // adjust the path as needed
const { USER_JWT_SECRET } = require('../Config/config');
const nodemailer = require("nodemailer");
const { validateEmail, validatePassword } = require('../Utils/validators');
const Order = require('../Model/orderModel');

const registerUser = async (data) => {
  const { username, email, password } = data;

  validateEmail(email);
  validatePassword(password);

  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const newUser = await User.create({ username, email, password });

  return {
    message: "Registration successful",
    user: {
      username: newUser.username,
      email: newUser.email,
      userNumber: newUser.userNumber
    }
  };
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

  const requiredFields = ['phone', 'addressLine', 'pincode', 'state', 'district'];
  const types = ['home', 'office'];
  const missingFields = {};

  types.forEach((type) => {
    const addr = user.addresses.find(a => a.type === type);
    if (!addr) {
      missingFields[type] = 'address missing';
    } else {
      const missing = requiredFields.filter(field => !addr[field]);
      if (missing.length > 0) {
        missingFields[type] = missing;
      }
    }
  });

  return {
    message: Object.keys(missingFields).length === 0
      ? "All required addresses and fields are present"
      : "Some address fields are missing",
    missingFields
  };
};


const updateAddress = async (userNumber, data) => {
  const { type, phone, addressLine, pincode, state, district } = data;
  if (!['home', 'office'].includes(type)) {
    throw new Error("Address type must be 'home' or 'office'");
  }

  const user = await User.findOne({ userNumber });
  if (!user) throw new Error("User not found");

  const index = user.addresses.findIndex(a => a.type === type);

  const newAddress = { type, phone, addressLine, pincode, state, district };

  if (index !== -1) {
    user.addresses[index] = newAddress;
  } else {
    user.addresses.push(newAddress);
  }

  await user.save();

  return { message: `${type} address updated successfully`, addresses: user.addresses };
};



const sendOtpToEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  // Create a test account and transporter using Ethereal
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: `"Demo App" <${testAccount.user}>`,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("OTP email preview URL:", nodemailer.getTestMessageUrl(info));

  return { message: "OTP sent (simulated). Check console for preview link." };
};


const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
    throw new Error("OTP is invalid or expired");
  }

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return { message: "OTP verified successfully" };
};

const resetPassword = async (email, newPassword) => {
  validateEmail(email);           // Checks valid email format
  validatePassword(newPassword); // Checks password rules (e.g., min 8 chars)

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  user.password = newPassword; // Plain text — should be hashed in pre-save hook
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  return { message: "Password reset successful" };
};

const displayAllUsers = async () => {
  const users = await User.find();
  return users;
};

const displaySpecificUser = async (userNumber) => {
  const user = await User.findOne({ userNumber });
  if (!user) throw new Error("User not found");

  const userOrders = await Order.find({ "user.userId": user._id }); // Match nested field
  return { user, userOrders };
};

const searchUser = async (value) => {
  const user = await User.findOne({
    $or: [
      { userNumber: value },
      { email: value },
      { username: value }
    ]
  });

  if (!user) throw new Error("User not found");

  const userOrders = await Order.find({ "user.userId": user._id });
  return { user, userOrders };
};


module.exports = {
  registerUser,
  loginUser,
  checkAddress,
  updateAddress,
  sendOtpToEmail,
  verifyOtp,
  resetPassword,
  displayAllUsers,
  displaySpecificUser,
  searchUser
};
