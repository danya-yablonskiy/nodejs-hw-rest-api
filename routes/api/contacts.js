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

router.get("/", getAllContacts);

router.get("/:contactId", checkContactId, getOneContactById);

router.post("/", createContact);

router.delete("/:contactId", checkContactId, deleteContactByID);

router.put("/:contactId", checkContactId, updateContactById);

router.patch("/:contactId/favorite", checkContactId, updateStatusContact);

module.exports = router;
