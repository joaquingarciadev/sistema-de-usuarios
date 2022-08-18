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

module.exports = router;
