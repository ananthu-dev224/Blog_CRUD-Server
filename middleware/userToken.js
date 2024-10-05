const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

const userTokenVerify = async (req, res, next) => {
  console.log("Verifying access...")
  const auth_header = req.headers["authorization"];
  if (!auth_header) {
    return res
      .status(400)
      .json({ message: "No token in request", status: "error" });
  }

  const token = auth_header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token", status: "error" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying user token:", error);
    return res.status(401).json({ message : "Invalid authorization token", status:'error' });
  }
};

module.exports = userTokenVerify;
