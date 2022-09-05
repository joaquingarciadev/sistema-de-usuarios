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
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

router
    .route("/users/all")
    .get(verifyToken, checkRole(["admin"]), getUsers)
    .delete(verifyToken, checkRole(["admin"]), deleteUsers);
router
    .route("/users/:id")
    .get(verifyToken, checkRole(["admin"]), getUser)
    .put(verifyToken, checkRole(["admin"]), updateUser)
    .delete(verifyToken, checkRole(["admin"]), deleteUser);

module.exports = router;
