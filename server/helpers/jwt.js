const jwt = require("jsonwebtoken");
const key = process.env.SECRET_KEY || "Its-a-Secret";

const generateToken = (payload) => {
  return jwt.sign(payload, key);
};

const verifyToken = (token) => {
  return jwt.verify(token, key);
};

module.exports = {
  generateToken,
  verifyToken,
};
