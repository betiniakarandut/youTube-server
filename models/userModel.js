import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
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
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
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
    }
})

const User = mongoose.model('User', userSchema)

export default User;