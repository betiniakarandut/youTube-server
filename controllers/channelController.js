import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

export const createChannel = async (req, res) => {
    try {
        const userId = req.user._id;
        const username = req.user.username;
        const { name, description } = req.body;

        // Check if user is authenticated
        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized or user does not exist"
            });
        }

        // Check if the user already has a channel
        const existingChannel = await Channel.findOne({ creatorId: userId });
        console.log(existingChannel)
        if (existingChannel) {
            return res.status(400).json({
                status: "FAILED",
                message: "Bad request: User cannot create more than one channel"
            });
        }


        // If the user is authenticated, create a channel for that user
        const channel = new Channel({
            name,
            description,
            creatorId: userId,
            subscribers: [],
            subscribersCount: 0,
            createdAt: Date.now(),
        });

        const savedChannel = await channel.save();
        
        return res.status(200).json({
            status: "SUCCESS",
            message: `Channel was created for ${username} and your channel name is ${name}`,
            savedChannel,
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

export const subscribeChannel = async (req, res) => {
    try {
        const userId = req.user._id;
        const channelId = req.params.channelId;

        // Check if the user is authenticated
        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }
        
        // Check if the user is already subscribed to this channel
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({
                status: "FAILED",
                message: "Channel not found"
            });
        }

        console.log("this is channel: ", channel)
        if (channel.subscribers.includes(userId)) {
            return res.status(400).json({
                status: "FAILED",
                message: "User already subscribed to this channel",
            });
        }

        // Subscribe the user to the channel
        channel.subscribers.push(userId);
        channel.subcribersCount += 1;
        await channel.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Subscribed",
            channel
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
        });
    }
}

export const unSubscribeChannel = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const userId = req.user._id;

        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }

        const existingChannel = await Channel.findById(channelId);
        if (!existingChannel){
            return res.status(404).json({
                status: "FAILED",
                message: "Channel not found"
            });
        }

        existingChannel.subscribers.pop(userId);
        existingChannel.subcribersCount -= 1;

        existingChannel.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Unsubscribed",
            existingChannel,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}