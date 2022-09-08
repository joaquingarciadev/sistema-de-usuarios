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
        image: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },

        google: String,
        facebook: String,
        github: String,

        emailVerified: { type: Boolean, default: false },
        emailVerificationToken: String,
        passwordResetToken: String,
    },
    { timestamps: true }
);

userSchema.methods.hiddenFields = function () {
    if (this.password) delete this.password;
    return this;
};

module.exports = mongoose.model("User", userSchema);
