// const { Types } = require("mongoose");
const { isValidObjectId } = require("mongoose");
const AppError = require("../utils/AppError");

const checkContactId = async (req, res, next) => {
  //   const id = req.params.contactId;
  //   const isValidId = Types.ObjectId.isValid(id);
    
  // ?????????????????????? Чому тут false ???????????????????????
  //   console.log(isValidId);
    
  //   if (!isValidId) throw AppError(404, "Contact does not exists");
  //   next();
    if (!isValidObjectId(req.params.contactId)) {
      next(AppError(400, "Contact does not exists"));
    }
    next();
};

module.exports = checkContactId;
