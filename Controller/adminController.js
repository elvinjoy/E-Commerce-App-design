const { adminRegister, adminLogin } = require('../Functions/adminAuthFunction');

const adminRegisterController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const { admin, token } = await adminRegister(username, email, password);
    res.status(201).json({ admin, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const adminLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { admin, token } = await adminLogin(email, password);
    res.status(200).json({ admin, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { adminRegisterController, adminLoginController };
