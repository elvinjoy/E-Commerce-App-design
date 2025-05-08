const jwt = require('jsonwebtoken');
const { USER_JWT_SECRET } = require('../Config/config');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, USER_JWT_SECRET);
    req.user = { userNumber: decoded.userId }; // ✅ match with `userId: user.userNumber` from login
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };
