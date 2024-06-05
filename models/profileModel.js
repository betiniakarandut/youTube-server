import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String, required: true },
    email: { type: String, ref: 'User', required: true },
    phone: { type: String, ref: 'User', required: true },
    address: { type: String, required: true },
    zip_code: { type: String, required: true },
    hobby: { type: String },
    bio: { type: String, required: true },
    profile_image: { type: String },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
