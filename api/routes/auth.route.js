const router = require("express").Router();
const passport = require("passport");
// Import controllers
const {
    login,
    signup,
    logout,
    verifyEmail,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    oauth,
    onetap,
} = require("../controllers/auth.controller");
// Import middlewares
const { verifyToken, refreshToken } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", verifyToken, logout);
router.post("/refresh-token", refreshToken);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.get("/reset/:token", verifyResetToken);
router.post("/reset/:token", resetPassword);

// OAuth routes.
router.get("/auth/success", oauth);
// Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: process.env.URL_CLIENT + "/login",
    }),
    (req, res) => {
        res.redirect(process.env.URL_CLIENT + "/login");
    }
);
// Facebook
router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }));
router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: process.env.URL_CLIENT + "/login",
    }),
    (req, res) => {
        res.redirect(process.env.URL_CLIENT + "/login");
    }
);
// Github
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
        failureRedirect: process.env.URL_CLIENT + "/login",
    }),
    (req, res) => {
        res.redirect(process.env.URL_CLIENT + "/login");
    }
);

// Google One Tap
router.post("/auth/google/onetap", onetap);

module.exports = router;
