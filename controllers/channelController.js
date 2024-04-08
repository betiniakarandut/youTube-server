import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

export const channel = async (req, res) => {
    try {
        const userId = req.user._id;
        const username = req.user.username;
        // console.log('userName:', username);
        const { name, description } = req.body;
        const channelId = Channel.channelId;

        // check if user is authenticated
        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized or user does not exist"
            });
        }

        //check if there is an existing channel with user Id
        const existingChannel = await Channel.findOne(userId);
        if (existingChannel) {
            return res.status(400).json({
                status: "FAILED",
                message: "Bad request: User cannot create more than one channel"
            });
        }
        // if user is authenticated, create a channel for that user
        const newChannel = new Channel({
            name,
            description,
            userId,
            createdAt: Date.now()
        });
        const savedChannel = await newChannel.save();
        if (!savedChannel) {
            return res.status(400).json({
                status: "FAILED",
                message: "Oops! Something went wrong. Refresh and try again"
            });
        }
        
        return res.status(200).json({
            status: "SUCCESS",
            message: `Channel was created for ${username} and your channel name is ${name}`,
            channelId: savedChannel._id,
            subcribers: savedChannel.subcribers,
            createdAt: savedChannel.createdAt,
            videos: [],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}

export const deleteChannel = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const userId = req.user._id;
        // console.log('This is userId', userId);
        // console.log('This is channelId', channelId);

        //ensure user is the owner of the channel
        const channel = await Channel.findOne({_id: channelId});
        console.log("This is channel object: ", channel)
        if (!channel) {
            return res.status(403).json({
                status: "FAILED",
                message: "User is unauthorized to perform this operation"
            });
        }

        const findChannelById = await Channel.findOneAndDelete(channelId);
        if (!findChannelById) {
            return res.status(404).json({
                status:"FAILED",
                message: "Not Found: user has no such channel"
            });
        }
        await Channel.findByIdAndDelete(channelId);

        return res.status(200).json({
            status: "SUCCESS",
            message: "You successfully deleted this channel"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
        
    }
    
}

export const updateChannel = async (req, res) => {
    try {
        const userId = req.user._id;
        const channelId = req.params.channelId;
        const { name, description } = req.body;
        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized",
            });
        }

        const retrieveChannel = await Channel.findOne({_id: channelId});
        if (!retrieveChannel) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found: No existing channel"
            })
        }
        // check what action wants to perform
        if(name) retrieveChannel.name = name;
        if(description) retrieveChannel.description = description;

        await retrieveChannel.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Your channel was updated successfully",
            name: retrieveChannel.name,
            description: retrieveChannel.description
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}