const router = require("express").Router();
// Import controllers
const { login, signup, logout } = require("../controllers/auth.controller");
// Import middlewares
const { verifyToken, refreshToken } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", verifyToken, logout);
// router.post("/forgot-password", forgotPassword);
router.post("/refresh-token", refreshToken);

module.exports = router;
