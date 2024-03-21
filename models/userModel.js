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
        lowercase: true,  
    },
    password: {
        type: String,
        // required: true,
        minlength: 8,
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
        validator: {
            validator: function (value){
                return /^\d{3}-\d{3}-\d{4}$/.test(value);
            }
        }
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