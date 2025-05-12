const {
  registerUser,
  loginUser,
  checkAddress,
  updateAddress
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

module.exports = {
  registerController,
  loginController,
  checkAddressFields,
  updateMissingAddressFields,
};
