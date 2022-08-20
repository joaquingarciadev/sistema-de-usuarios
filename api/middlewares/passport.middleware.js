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
                const { id, displayName, photos, emails } = profile;
                const imageOauth = photos && photos.length ? photos[0].value : null;
                const email = emails && emails.length ? emails[0].value : "";

                const user = await User.findOne({ google: id });
                if (user) return done(null, user);

                const userSameEmail = await User.findOne({ email });
                if (userSameEmail) {
                    userSameEmail.google = id;
                    userSameEmail.save();
                    return done(null, userSameEmail);
                }

                const newUser = await User.create({
                    username: displayName + "-" + uuidv4(),
                    email,
                    imageOauth,
                    google: id,
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
                const { id, displayName, photos, emails } = profile;
                const imageOauth = photos && photos.length ? photos[0].value : null;
                const email = emails && emails.length ? emails[0].value : "";

                const user = await User.findOne({ facebook: id });
                if (user) return done(null, user);

                const userSameEmail = await User.findOne({ email });
                if (userSameEmail) {
                    userSameEmail.facebook = id;
                    userSameEmail.save();
                    return done(null, userSameEmail);
                }

                const newUser = await User.create({
                    username: displayName + "-" + uuidv4(),
                    email,
                    imageOauth,
                    facebook: id,
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
                const { id, displayName, photos, emails } = profile;
                const imageOauth = photos && photos.length ? photos[0].value : null;
                const email = emails && emails.length ? emails[0].value : "";

                const user = await User.findOne({ github: id });
                if (user) return done(null, user);

                const userSameEmail = await User.findOne({ email });
                if (userSameEmail) {
                    userSameEmail.github = id;
                    userSameEmail.save();
                    return done(null, userSameEmail);
                }

                const newUser = await User.create({
                    username: displayName + "-" + uuidv4(),
                    email,
                    imageOauth,
                    github: id,
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
