const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        image: String,
        imageOauth: String,

        google: String,
        facebook: String,
        github: String,
    },
    { timestamps: true }
);

userSchema.methods.hiddenFields = function () {
    if (this.password) delete this.password;
    return this;
};

module.exports = mongoose.model("User", userSchema);
