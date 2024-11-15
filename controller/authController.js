const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const createJwt = require("../utils/generateToken");
const ResponseEnum = require("../utils/enums/responseEnum");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(ResponseEnum.ERROR.USER_EXISTS.statusCode)
        .json(ResponseEnum.ERROR.USER_EXISTS);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // JWT token
    const token = createJwt(newUser._id, newUser.email);
    res.status(ResponseEnum.SUCCESS.REGISTER_SUCCESS.statusCode).json({
      ...ResponseEnum.SUCCESS.REGISTER_SUCCESS,
      token,
      user: newUser,
    });
  } catch (error) {
    console.log("Error at register", error);
    res
      .status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode)
      .json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(ResponseEnum.ERROR.USER_NOT_FOUND.statusCode)
        .json(ResponseEnum.ERROR.USER_NOT_FOUND);
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(ResponseEnum.ERROR.INVALID_PASSWORD.statusCode)
        .json(ResponseEnum.ERROR.INVALID_PASSWORD);
    }

    // JWT token
    const token = createJwt(user._id, user.email);

    res
      .status(ResponseEnum.SUCCESS.LOGIN_SUCCESS.statusCode)
      .json({ ...ResponseEnum.SUCCESS.LOGIN_SUCCESS, token, user });
  } catch (error) {
    console.log("Error at login",error)
    res
      .status(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR.statusCode)
      .json(ResponseEnum.ERROR.INTERNAL_SERVER_ERROR);
  }
};



module.exports = { signup, login };