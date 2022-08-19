const User = require("../models/user.model");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const { v4: uuidv4 } = require("uuid");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.URL_API + "/api/auth/google/callback",
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ google: profile.id });
                if (user) return done(null, user);

                const newUser = await User.create({
                    username: profile.displayName + "-" + uuidv4(),
                    email: profile.emails[0].value,
                    imageOauth: profile.photos[0].value,
                    google: profile.id,
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.URL_API + "/api/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ facebook: profile.id });
                if (user) return done(null, user);

                const newUser = await User.create({
                    username: profile.displayName + "-" + uuidv4(),
                    email: profile.emails[0].value,
                    imageOauth: profile.photos[0].value,
                    facebook: profile.id,
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.URL_API + "/api/auth/github/callback",
            profileFields: ["id", "displayName", "photos", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ github: profile.id });
                if (user) return done(null, user);

                const newUser = await User.create({
                    username: profile.displayName + "-" + uuidv4(),
                    email: profile.email || "",
                    imageOauth: profile.photos[0].value,
                    github: profile.id,
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
