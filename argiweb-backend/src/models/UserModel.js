const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: false },
        phone: { type: String, required: true },
        address: { type: String, required: false},
        access_token: { type: String },
        refresh_token: { type: String },
        gender: { 
            type: String, 
            enum: ["Nam", "Nữ", "Khác"],
            required: false, 
            default: "Khác"
        },
        birthday: { type: Date, required: false },
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;