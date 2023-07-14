const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getOneContactById,
  createContact,
  deleteContactByID,
  updateContactById,
} = require("../../controllers/controllers");

router.get("/", getAllContacts);

router.get("/:contactId", getOneContactById);

router.post("/", createContact);

router.delete("/:contactId", deleteContactByID);

router.put("/:contactId", updateContactById);

module.exports = router;
