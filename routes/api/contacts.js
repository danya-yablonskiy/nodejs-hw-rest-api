const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getOneContactById,
  createContact,
  deleteContactByID,
  updateContactById,
  updateStatusContact,
} = require("../../controllers/controllers");

const checkContactId = require("../../middlewares/contactMiddlwares");
const authecticate = require('../../middlewares/authenticate')

router.get("/", authecticate, getAllContacts);

router.get("/:contactId", authecticate, checkContactId, getOneContactById);

router.post("/", authecticate, createContact);

router.delete("/:contactId", authecticate, checkContactId, deleteContactByID);

router.put("/:contactId", authecticate, checkContactId, updateContactById);

router.patch("/:contactId/favorite", authecticate, checkContactId, updateStatusContact);

module.exports = router;
