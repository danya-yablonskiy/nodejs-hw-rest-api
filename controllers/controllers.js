const Joi = require("joi");
const Contact = require("../models/contactModel");
const AppError = require("../utils/AppError");

const schema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(),
    })
    .validate(data);

const updateFavoriteSchema = (data) =>
  Joi.object()
    .keys({
      favorite: Joi.boolean().required(),
    })
    .validate(data);

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner }, "", { skip, limit }).populate(
    "owner",
    "email"
  );

  res.json({ contacts });
};

const getOneContactById = async (req, res, next) => {
  try {
    const getId = req.params.contactId;

    const oneContact = await Contact.findById(getId);

    if (!oneContact) {
      throw AppError(404, "Not found");
    }

    res.json({ oneContact });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { error } = schema(req.body);

    if (error) {
      throw AppError(400, "Missing required name field");
    }
    const { _id: owner } = req.user;

    const newContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContactByID = async (req, res, next) => {
  try {
    const getId = req.params.contactId;
    const oneContact = await Contact.findByIdAndDelete(getId);

    if (!oneContact) {
      throw AppError(404, "Not found");
    }

    res.json({ message: "Contact deleted", oneContact });
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const getId = req.params.contactId;
    const { error } = schema(req.body);

    if (error) {
      throw AppError(400, "Missing fields");
    }

    const update = await Contact.findByIdAndUpdate(getId, req.body);
    res.json(update);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const getId = req.params.contactId;
    const { error } = updateFavoriteSchema(req.body);

    const update = await Contact.findByIdAndUpdate(getId, req.body, {
      new: true,
    });

    if (error) {
      throw AppError(400, "Missing field favorite");
    }

    if (!update) {
      throw AppError(404, "Not found ");
    }

    res.json(update);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getOneContactById,
  createContact,
  deleteContactByID,
  updateContactById,
  updateStatusContact,
};
