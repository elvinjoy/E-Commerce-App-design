const { register, login } = require('../Functions/userAuthFunction');

const registerController = async (req, res) => {
  const { username, email, password, phone, address, pincode } = req.body;

  try {
    const { user, token } = await register(username, email, password, phone, address, pincode);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await login(email, password);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { registerController, loginController };
