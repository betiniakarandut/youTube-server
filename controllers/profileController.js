import Profile from "../models/profileModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
});

export const getUserProfile = async(req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            res.status(403).send('Unauthorized');
        }

        const { 
            full_name, 
            address,
            zip_code,
            maiden_name,
            hobby,
            bio,
            date_of_birth,
            gender,
            nationality
        } = req.body;
        
        const file = req.files['file'][0];
        if (!file) {
            return res.status(404).json({
                status: "FAILED",
                message: "File not found"
            });
        }
        const result1 = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        console.log(result1)
        
        if (!full_name || !address || !zip_code || !maiden_name || !hobby || !bio || !date_of_birth || !gender || !nationality) {
            res.status(400).send('Incomplete data');
        }
        if (bio.length < 50) {
            const msg = 'Please enter at least 50 characters in the bio field';
            res.status(400).send(`message: ${msg}`);
        }
        const existingProfile = await Profile.findOne(userId);
        if (existingProfile){
            res.status(400).send('This user has an existing profile.');
        }
        const newProfile = new Profile({
            full_name,
            address,
            zip_code,
            maiden_name,
            hobby,
            bio,
            profile_image: file,
            date_of_birth,
            gender,
            nationality,
        });
        const Profile = await newProfile.save();
        res.status(201).send({
            message: 'New profile created',
            data: Profile
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: 'Internal server error'})
    }
}

export const deleteProfile = async(req, res) => {
    try {
        const profileId = req.params.profileId;
        const userId = req.user._id;
        const isAdmin = process.env.ADMIN.includes(req.user.email);
        if(!userId || !isAdmin){
            res.status(403).send("Action Forbiddened");
        }
        if(!profileId){
            res.status(400).send('Profile ID missing in parameters')
        }
        const profile = await Profile.findById(profileId);
        if(!profile){
            res.status(404).send('Profile not found.')
        }
        await Profile.findByIdAndDelete(profileId);
        
        res.status(200).send('Profile deleted from database successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Internal server error.'})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const existingProfile = await Profile.findOne({ userId: userId });
        
        if (!existingProfile) {
            return res.status(404).send('Profile not found!');
        }

        const {
            full_name,
            address,
            zip_code,
            maiden_name,
            hobby,
            bio,
            profile_image,
            date_of_birth,
            gender,
            nationality
        } = req.body;

        existingProfile.full_name = full_name || existingProfile.full_name;
        existingProfile.address = address || existingProfile.address;
        existingProfile.zip_code = zip_code || existingProfile.zip_code;
        existingProfile.maiden_name = maiden_name || existingProfile.maiden_name;
        existingProfile.hobby = hobby || existingProfile.hobby;
        existingProfile.bio = bio || existingProfile.bio;
        existingProfile.profile_image = profile_image || existingProfile.profile_image;
        existingProfile.date_of_birth = date_of_birth || existingProfile.date_of_birth;
        existingProfile.gender = gender || existingProfile.gender;
        existingProfile.nationality = nationality || existingProfile.nationality;

        await existingProfile.save();
        res.status(200).send('Profile updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

