const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");

const Joi = require("joi");
const gravatar = require("gravatar");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const subscriptionList = require("../constants/subscriptionList");
const resizeImage = require("../utils/resizeImage");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registerSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      subscription: Joi.string(),
    })
    .validate(data);

const loginSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    })
    .validate(data);

const updateSubscriptionSchema = (data) =>
  Joi.object()
    .keys({
      subscription: Joi.string()
        .valid(...Object.values(subscriptionList))
        .required(),
    })
    .validate(data);

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw AppError(409, "Email already in use");
    }

    const { error } = registerSchema(req.body);

    if (error) {
      throw AppError(400, "Enter the correct data");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema(req.body);

    if (error) {
      throw AppError(400, "Enter the correct data");
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw AppError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw AppError(401, "Email or password invalid");
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { error } = updateSubscriptionSchema(req.body);

    if (error) {
      throw AppError(400, "Enter the correct data");
    }

    const { _id } = req.user;

    const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

    if (!user) {
      throw AppError(404, "Not found2");
    }

    res.json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;

    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);
    resizeImage(resultUpload);
    const avatarURL = path.join("avatars", filename);
    console.log(avatarURL);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};
