const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        status: {
            type: String,
            default: "INACTIVE",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
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
    delete this.password;
    return this;
};

module.exports = mongoose.model("User", userSchema);
