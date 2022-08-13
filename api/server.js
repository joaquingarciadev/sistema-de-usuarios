const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

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
app.use(cors());

// Import routes
app.use("/api", require("./routes/auth.route"));
app.use("/api", require("./routes/user.route"));
app.use("/api", require("./routes/admin.route"));

// OAuth authentication routes
app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: [
            "profile",
            "email",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/spreadsheets.readonly",
        ],
        accessType: "offline",
        prompt: "consent",
    })
);

// Images path
app.use("/uploads", express.static("./uploads"));

// Connect to DB
mongoose.connect(process.env.URL_DB, (err) => {
    if (err) throw err;
    console.log("Connected Database");
});

// Run server
app.get("/", (req, res) => {
    res.send("API Running");
});

// Middleware for error handling
app.use(require("./middlewares/error.middleware"));

app.listen(process.env.PORT, () => {
    console.log(
        `Server running on port ${process.env.PORT}, url: ${process.env.URL}:${process.env.PORT}`
    );
});
