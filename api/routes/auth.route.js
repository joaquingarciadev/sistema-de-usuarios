const router = require("express").Router();
const passport = require("passport");
// Import controllers
const { login, signup, logout, oauth } = require("../controllers/auth.controller");
// Import middlewares
const { verifyToken, refreshToken } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", verifyToken, logout);
// router.post("/forgot-password", forgotPassword);
router.post("/refresh-token", refreshToken);

// OAuth authentication routes.
router.get("/auth/success", oauth);
// Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.URL_CLIENT + "/login",
        failureRedirect: process.env.URL_CLIENT + "/login",
    })
);
// Facebook
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ['email', 'public_profile'] }));
router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: process.env.URL_CLIENT + "/login",
        failureRedirect: process.env.URL_CLIENT + "/login",
    })
);

module.exports = router;
