const jwt = require("jsonwebtoken");

const createJwt = (userId, email) => {
  const payload = {
    userId,
    email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
  return token;
};

module.exports = createJwt;