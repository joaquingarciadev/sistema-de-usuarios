const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res
            .status(401)
            .json({ error: "Username or password is incorrect" });

    const user = await User.findOne({ username });
    if (!user)
        return res
            .status(401)
            .json({ error: "Username or password is incorrect" });

    if (!(await bcrypt.compare(password, user.password)))
        return res
            .status(401)
            .json({ error: "Username or password is incorrect" });

    // Make sure the user has been verified
    if (!user.emailVerified)
        return res
            .status(401)
            .json({ error: "Your account has not been verified." });

    try {
        // Update status
        await User.findByIdAndUpdate(user.id, { status: "active" });

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

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(401).json({ error: "Complete all fields" });

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user && user.emailVerified)
        return res.status(400).json({ error: "This user already exists" });

    try {
        let passwordHash;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            paspasswordHash = await bcrypt.hash(password, salt);
        }

        // Email verification token
        const token = jwt.sign({ email }, process.env.JWT_KEY, {
            expiresIn: "15m",
        });

        const newUser = await User.create({
            username,
            email,
            password: passwordHash,
            emailVerificationToken: token,
        });

        // Send email
        const url = `${process.env.URL_CLIENT}/verify-email/${token}`;
        const html = `
        <div>
            <h2>Hola ${newUser.username}!</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a href=${url} target="_blank">Confirmar Cuenta</a>
        </div>`;
        await sendEmail(newUser.email, "Verify email", html);

        res.json({ message: "User created successfully" });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        // Update status
        await User.findByIdAndUpdate(req.user.id, { status: "inactive" });

        await req.logout();

        res.json({ message: "Logout successful" });
    } catch (err) {
        next(err);
    }
};

const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Token not valid" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.emailVerified)
            return res
                .status(200)
                .json({ error: "Your account has already been verified" });
        if (user.emailVerificationToken !== token)
            return res.status(400).json({ error: "Token not valid" });

        user.emailVerified = true;
        user.emailVerificationToken = "";
        user.save();

        res.json({ message: "Email verified successfully" });
    } catch (err) {
        next(err);
    }
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Password reset token
        const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, {
            expiresIn: "15m",
        });
        user.passwordResetToken = token;
        user.save();

        // Send email
        const url = `${process.env.URL_CLIENT}/password-reset/${token}`;
        const html = `
        <div>
            <h2>Hola ${user.username}</h2>
            <p>Para restaurar tu contraseña, ingresa al siguiente enlace</p>
            <a href=${url} target="_blank">Restaurar contraseña</a>
        </div>`;
        await sendEmail(user.email, "Reset password", html);

        res.json({ message: "Please verify your email address" });
    } catch (err) {
        next(err);
    }
};

const verifyResetToken = async (req, res, next) => {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: "Token not valid" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.passwordResetToken !== token)
            return res.status(400).json({ error: "Token not valid" });

        res.json({ message: "Token verified successfully" });
    } catch (err) {
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.passwordResetToken !== token)
            return res.status(400).json({ error: "Token not valid" });

        user.password = passwordHash;
        user.passwordResetToken = "";
        user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
};

// OAuth controllers
const oauth = async (req, res, next) => {
    try {
        // req.user → cookie
        const user = await User.findOne({ username: req.user.username });
        await User.findByIdAndUpdate(user.id, { status: "active" });

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

const onetap = async (req, res, next) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: id, name: username, email, picture: image } = payload;

        const user = await User.findOne({ google: id });
        if (user) {
            await User.findByIdAndUpdate(user.id, { status: "active" });
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
            return res.json({
                user: user.hiddenFields(),
                token,
                refreshToken,
            });
        }

        const userSameEmail = await User.findOne({ email });
        if (userSameEmail) {
            await User.findByIdAndUpdate(userSameEmail.id, {
                status: "active",
                google: id,
            });
            const token = jwt.sign(
                { id: userSameEmail.id },
                process.env.JWT_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                }
            );
            const refreshToken = jwt.sign(
                { id: userSameEmail.id },
                process.env.JWT_REFRESH_KEY,
                {
                    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
                }
            );
            return res.json({
                user: user.hiddenFields(),
                token,
                refreshToken,
            });
        }

        const newUser = await User.create({
            username: username + "-" + uuidv4().slice(0, 5),
            email,
            image,
            google: id,
            status: "active",
            emailVerified: true,
        });
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const refreshToken = jwt.sign(
            { id: newUser.id },
            process.env.JWT_REFRESH_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            }
        );
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
    verifyEmail,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    oauth,
    onetap,
};
