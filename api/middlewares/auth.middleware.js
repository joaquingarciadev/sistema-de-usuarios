const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = async (req, res, next) => {
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = await jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded.id, { password: 0 });
        if (!user) return res.status(404).json({ error: "User not found" });
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
};

const refreshToken = async (req, res, next) => {
    const authHeader = req.header("authorization");
    const refreshToken = authHeader && authHeader.split(" ")[1];

    if (!refreshToken)
        return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = await jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_KEY
        );

        const user = await User.findById(decoded.id, { password: 0 });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const newRefreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            }
        );

        res.json({
            user: user.hiddenFields(),
            token: newToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN")
        return res.status(401).json({ error: "Unauthorized" });
    next();
};

module.exports = { verifyToken, refreshToken, isAdmin };
