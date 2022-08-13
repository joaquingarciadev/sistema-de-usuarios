const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

const getAccount = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    try {
        res.json({ user: user.hiddenFields() });
    } catch (err) {
        next(err);
    }
};

const updateAccount = async (req, res, next) => {
    const { username, email, password } = req.body;
    let passwordHash;
    const image = "/" + req.file.path.replace(/\\/g, "/");

    // Delete old image
    if (req.user.image && req.user.image !== image) {
        fs.unlinkSync("." + req.user.image);
    }

    if (req.user.username === "admin") {
        fs.unlinkSync("." + image);
        return res.status(400).json({ error: "Admin user can't be updated" });
    }

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.user.id, {
            username,
            email,
            password: passwordHash,
            image,
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });

        res.json({
            user: user.hiddenFields(),
            token,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
};

const deleteAccount = async (req, res, next) => {
    if (req.user.username === "admin")
        return res.status(400).json({ error: "Admin user can't be deleted" });

    // Delete image
    if (req.user.image) {
        fs.unlinkSync("." + req.user.image);
    }

    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    try {
        res.json({
            user: user.hiddenFields(),
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAccount,
    updateAccount,
    deleteAccount,
};