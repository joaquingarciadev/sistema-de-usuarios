const router = require("express").Router();
// Import controllers
const { getAccount, updateAccount, deleteAccount } = require("../controllers/user.controller");
// Import middlewares
const { verifyToken } = require("../middlewares/auth.middleware");
// Multer for image upload
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

router
    .route("/user/account")
    .get(verifyToken, getAccount)
    .put(verifyToken, upload.single("image"), updateAccount)
    .delete(verifyToken, deleteAccount);

module.exports = router;
