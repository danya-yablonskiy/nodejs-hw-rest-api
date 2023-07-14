const { nanoid } = require("nanoid");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const schema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    })
    .validate(data);

const getAllContacts = async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ msg: "success", contacts });
};

const getOneContactById = async (req, res, next) => {
  try {
    const getId = req.params.contactId;

    const oneContact = await getContactById(getId);

    if (!oneContact) {
      throw new Error();
    }
    res.json({ oneContact });
  } catch (_) {
    res.status(404).json({ message: "Not found" });
  }
};

const createContact = async (req, res, next) => {
  try {
    const contactData = req.body;
    const { error } = schema(req.body);

    if (error) {
      throw new Error();
    }

    const newContact = {
      id: nanoid(),
      ...contactData,
    };

    addContact(newContact);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: "missing required name field" });
  }
};

const deleteContactByID = async (req, res, next) => {
  try {
    const getId = req.params.contactId;
    const oneContact = await removeContact(getId);

    if (!oneContact) {
      throw new Error();
    }

    res.json({ oneContact });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const getId = req.params.contactId;
    const { error } = schema(req.body);
    if (error) {
      throw new Error();
    }

    const update = await updateContact(getId, req.body);
    res.json(update);
  } catch (error) {
    res.status(400).json({ message: "missing fields" });
  }
};

module.exports = {
  getAllContacts,
  getOneContactById,
  createContact,
  deleteContactByID,
  updateContactById,
};
