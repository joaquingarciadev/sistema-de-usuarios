const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    },
    { timestamps: true }
);

userSchema.methods.hiddenFields = function () {
    delete this.password;
    return this;
};

module.exports = mongoose.model("User", userSchema);
