const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { v4: uuidv4 } = require("uuid");

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(401).json({ error: "Username or password is incorrect" });

    const user = await User.findOne({ username });
    if (!user || !bcrypt.compare(password, user.password))
        return res.status(401).json({ error: "Username or password is incorrect" });

    try {
        await User.findByIdAndUpdate(user.id, { status: "active" });

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

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(401).json({ error: "Complete all fields" });

    if (await User.findOne({ $or: [{ username }, { email }] }))
        return res.status(400).json({ error: "This user already exists" });

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: passwordHash,
        });
        res.json({ message: "User created successfully" });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { status: "inactive" });

        await req.logout();

        res.json({ message: "Logout successful" });
    } catch (err) {
        next(err);
    }
};

const oauth = async (req, res, next) => {
    try {
        // req.user → cookie
        const user = await User.findOne({ username: req.user.username });
        await User.findByIdAndUpdate(user.id, { status: "active" });

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

const onetap = async (req, res, next) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: id, name: username, email, picture: imageOauth } = payload;

        const user = await User.findOne({ google: id });
        if (user) {
            await User.findByIdAndUpdate(user.id, { status: "active" });
            const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            });
            return res.json({
                user: user.hiddenFields(),
                token,
                refreshToken,
            });
        }

        const userSameEmail = await User.findOne({ email });
        if (userSameEmail) {
            await User.findByIdAndUpdate(userSameEmail.id, { status: "active", google: id });
            const token = jwt.sign({ id: userSameEmail.id }, process.env.JWT_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            const refreshToken = jwt.sign({ id: userSameEmail.id }, process.env.JWT_REFRESH_KEY, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            });
            return res.json({
                user: user.hiddenFields(),
                token,
                refreshToken,
            });
        }

        const newUser = await User.create({
            username: username + "-" + uuidv4().slice(0, 5),
            email,
            imageOauth,
            google: id,
            status: "active",
        });
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const refreshToken = jwt.sign({ id: newUser.id }, process.env.JWT_REFRESH_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });
        res.json({
            user: newUser.hiddenFields(),
            token,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    login,
    signup,
    logout,
    oauth,
    onetap,
};
