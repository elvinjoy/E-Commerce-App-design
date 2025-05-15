const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel'); // adjust the path as needed
const { USER_JWT_SECRET } = require('../Config/config');
const nodemailer = require("nodemailer");
const{ GMAIL_USER, GMAIL_PASS } = require('../Config/config');

const registerUser = async (data) => {
  const { username, email, password } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const newUser = await User.create({
    username,
    email,
    password
  });

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

  const missingFields = [];

  if (!user.address) missingFields.push('address');
  if (!user.phone) missingFields.push('phone');
  if (!user.pincode) missingFields.push('pincode');
  if (!user.state) missingFields.push('state');
  if (!user.district) missingFields.push('district');

  return {
    message: missingFields.length === 0
      ? "All address fields are present"
      : "Address fields are missing",
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
        pincode: data.pincode,
        state: data.state,
        district: data.district
      }
    },
    { new: true }
  );

  if (!user) throw new Error("User not found");

  return { message: "Address updated successfully", user };
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
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  user.password = newPassword; // plain text — will be hashed in schema
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  return { message: "Password reset successful" };
};

module.exports = {
  registerUser,
  loginUser,
  checkAddress,
  updateAddress,
  sendOtpToEmail,
  verifyOtp,
  resetPassword
};
