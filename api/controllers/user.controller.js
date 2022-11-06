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
    let image, imagePath;
    if (req.file) {
        image =
            req.file &&
            process.env.URL_API + "/" + req.file.path.replace(/\\/g, "/");
        imagePath = image.replace(process.env.URL_API, ".");
    }

    const user = await User.findById(req.user.id);

    // This user can't be updated
    if (user.username === "admin") {
        if (image) fs.unlinkSync(imagePath);
        return res.status(400).json({ error: "Admin user can't be updated" });
    }

    if (await User.findOne({ $or: [{ username }, { email }] })) {
        if (image) fs.unlinkSync(imagePath);
        return res.status(400).json({ error: "This user already exists" });
    }

    if (
        password &&
        user.password &&
        !(await bcrypt.compare(password, user.password))
    ) {
        if (image) fs.unlinkSync(imagePath);
        return res
            .status(400)
            .json({ error: "New password cannot be the same as old" });
    }

    try {
        let passwordHash;
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

        // Delete old image
        if (image && user.image && user.image.includes(process.env.URL_API)) {
            let oldImage = user.image;
            let oldImagePath = oldImage.replace(process.env.URL_API, ".");
            if (imagePath !== oldImagePath) fs.unlinkSync(oldImagePath);
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            }
        );

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
    const user = await User.findById(req.user.id);

    // This user can't be deleted
    if (user.username === "admin")
        return res.status(400).json({ error: "Admin user can't be deleted" });

    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        // Delete image
        if (user.image && user.image.includes(process.env.URL_API)) {
            let image = user.image;
            let imagePath = image.replace(process.env.URL_API, ".");
            fs.unlinkSync(imagePath);
        }

        req.logout();

        res.json({ message: "User deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAccount,
    updateAccount,
    deleteAccount,
};
