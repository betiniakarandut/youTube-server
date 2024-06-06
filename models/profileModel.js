import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    label: {type: String, required: false},
    code: {type: String, required: false},
    currency: {type: String, required: false},
    _id: false,
})

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    full_name: { type: String, required: true },
    email: { type: String, ref: 'User' },
    phone: { type: String, ref: 'User' },
    address: { type: String, required: true },
    zip_code: { type: String, required: true },
    hobby: { type: String },
    bio: { type: String, required: true },
    maiden_name: {type: String, required: true},
    profile_image: { type: String },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    country: {type: countrySchema, default: {}},
    createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
