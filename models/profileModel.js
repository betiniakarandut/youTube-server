import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    full_name: String,
    email: {type: String, ref: 'User'},
    phone: {type: Number, ref: 'User'},
    address: String,
    zip_code: Number,
    maiden_name: String,
    hobby: String,
    bio: String,
    profile_image: String,
    date_of_birth: String,
    gender: String,
    nationality: String,
    createAt: {type: Date, default: Date.now()},
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;