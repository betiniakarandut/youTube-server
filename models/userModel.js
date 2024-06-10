import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 8,
        trim: true,
    },
    verified: {
        type: Boolean,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    permissions: {
        type: Array,
        default: [],
    },
    phone: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        country: String,
        postalcode: String,
    },
    watchedVideos: [],
    isPremium: {type: Boolean, default: false},
})

const User = mongoose.model('User', userSchema)

export default User;