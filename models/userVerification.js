import mongoose from "mongoose";

const userVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueId: String,
    createdAt: Date,
    expiresAt: Date,
})

const userVerification = mongoose.model('userVerification', userVerificationSchema)

export default userVerification;