const AppError = require("../utils/AppError");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;
const User = require("../models/userModel");

const authecticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    next(AppError(401, "Unauthorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user.token) {
      next(AppError(401, "Unauthorized"));
    }
    req.user = user;

    next();
  } catch (error) {
    next(AppError(401, "Unauthorized"));
  }
};
module.exports = authecticate;
