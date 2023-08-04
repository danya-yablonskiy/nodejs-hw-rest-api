const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
} = require("../../controllers/auth");
const authecticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current", authecticate, getCurrent);

router.post("/logout", authecticate, logout);

router.patch("/", authecticate, updateSubscription);

module.exports = router;
