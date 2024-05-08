import mongoose from "mongoose";

const userDashboardSchema = new mongoose.Schema({
    name: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,
    profileImage: String,
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Video', unique: true}],
});

const Dashboard = mongoose.model('Dashboard', userDashboardSchema);

export default Dashboard;