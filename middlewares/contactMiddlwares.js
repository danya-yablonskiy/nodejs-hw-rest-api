const { isValidObjectId } = require("mongoose");
const AppError = require("../utils/AppError");

const checkContactId = async (req, res, next) => {
  if (!isValidObjectId(req.params.contactId)) {
    next(AppError(400, "Invalid id"));
  }
  next();
};

module.exports = checkContactId;
