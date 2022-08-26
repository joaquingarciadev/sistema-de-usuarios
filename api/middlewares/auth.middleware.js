const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = async (req, res, next) => {
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded.id, { password: 0 });
        if (!user) return res.status(404).json({ error: "User not found" });

        req.user = { id: decoded.id };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
};

const refreshToken = async (req, res, next) => {
    const authHeader = req.header("authorization");
    const refreshToken = authHeader && authHeader.split(" ")[1];

    if (!refreshToken) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

        const user = await User.findById(decoded.id, { password: 0 });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_REFRESH_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });

        res.json({
            user: user.hiddenFields(),
            token: newToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        return res.status(401).json({ error: "Token invalid" });
    }
};

const checkRole = (roles) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id, { password: 0 });
        if (!user) return res.status(404).json({ error: "User not found" });

        if ([].concat(roles).includes(user.role)) next();
    } catch (err) {
        return res.status(403).json({ error: "User is not authorized" });
    }
};

module.exports = { verifyToken, refreshToken, checkRole };
