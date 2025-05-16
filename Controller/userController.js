const {
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
} = require('../helper/userAuthFunction');

const registerController = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: "Login failed!", error: error.message });
  }
};

const checkAddressFields = async (req, res) => {
  try {
    const result = await checkAddress(req.user.userNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
};


const updateMissingAddressFields = async (req, res) => {
  try {
    const result = await updateAddress(req.user.userNumber, req.body); // ✅ fixed
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Update failed!", error: error.message });
  }
};

const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const result = await sendOtpToEmail(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};


const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtp(email, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "OTP verification failed", error: error.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const result = await resetPassword(email, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Password reset failed", error: error.message });
  }
};

const displayAllUsersController = async (req, res) => {
  try {
    const users = await displayAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users", error: error.message });
  }
}

const displaySpecificUserController = async (req, res) => {
  try {
    const { userNumber } = req.params;
    const data = await displaySpecificUser(userNumber);
    res.status(200).json(data); // Will contain both user and userOrders
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user", error: error.message });
  }
};

const searchUserController = async (req, res) => {
  try {
    const { value } = req.params; // use `value` instead of `userNumber`
    const data = await searchUser(value);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user", error: error.message });
  }
};



module.exports = {
  registerController,
  loginController,
  checkAddressFields,
  updateMissingAddressFields,
  sendOtpController,
  verifyOtpController,
  resetPasswordController,
  displayAllUsersController,
  displaySpecificUserController,
  searchUserController
};
