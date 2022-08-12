const router = require("express").Router();
// Import controllers
const {
    getUser,
    updateUser,
    deleteUser,
    getUsers,
    deleteUsers,
} = require("../controllers/admin.controller");
// Import middlewares
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

router
    .route("/users")
    .get(verifyToken, isAdmin, getUsers)
    .delete(verifyToken, isAdmin, deleteUsers);
router
    .route("/user/:id")
    .get(verifyToken, isAdmin, getUser)
    .put(verifyToken, isAdmin, updateUser)
    .delete(verifyToken, isAdmin, deleteUser);

module.exports = router;
