const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("cookie-session");
const passport = require("passport");

// Import environment variables
require("dotenv").config();

// Parse json
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
// Cors
app.use(
    cors({ origin: process.env.URL_CLIENT, methods: "GET,POST,PUT,DELETE", credentials: true })
);

// Session
app.use(
    // session({
    //     secret: "secret",
    //     resave: true,
    //     saveUninitialized: true,
    //     cookie: { maxAge: 60000 },
    // })
    session({ name: "session", keys: ["secret"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

// Import middlewares
require("./middlewares/passport.middleware");

// Import routes
app.use("/api", require("./routes/auth.route"));
app.use("/api", require("./routes/user.route"));
app.use("/api", require("./routes/admin.route"));

// Images path
app.use("/uploads", express.static("./uploads"));

// Middleware for error handling
app.use(require("./middlewares/error.middleware"));

// Connect to DB
mongoose.connect(process.env.URL_DB, (err) => {
    if (err) throw err;
    console.log("Connected Database");
});

// Run server
app.get("/", (req, res) => {
    res.send("API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}, url: ${process.env.URL_API}`);
});