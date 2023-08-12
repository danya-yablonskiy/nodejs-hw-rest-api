const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");
const authecticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", register);

router.get("verify/:verificationCode", verifyEmail);

router.post("/verify", resendVerifyEmail);

router.post("/login", login);

router.get("/current", authecticate, getCurrent);

router.post("/logout", authecticate, logout);

router.patch("/", authecticate, updateSubscription);

router.patch("/avatars", authecticate, upload.single("avatar"), updateAvatar);

module.exports = router;
