import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

export const channel = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, description } = req.body;

        // check if user is authenticated
        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized or user does not exist"
            });
        }

        //check if there is an existing channel with user Id
        const existingChannel = await Channel.findById({_id: userId});
        if (existingChannel) {
            return res.status(400).json({
                status: "FAILED",
                message: "Bad request: User cannot create more than one channel"
            });
        }
        // if user is authenticated, create a channel for that user
        const newChannel = new Channel({
            name: name,
            description: description,
            createdAt: Date.now()
        });
        const savedChannel = await newChannel.save();
        if (!savedChannel) {
            return res.status(401).json({
                status: "FAILED",
                message: "Oops! Something went wrong. Refresh and try again"
            });
        }

        const userVideoList = await Video.findById({_id: userId});

        if (!userVideoList) {
            return res.status(401).json({
                status: "SUCCESS",
                message: "User has not uploaded any videos yet",
                videos: [],
            });
        }
        
        return res.status(200).json({
            status: "SUCCESS",
            message: `Channel was created for ${userId.name} and your channel name is ${name}`,
            channelId: savedChannel._id,
            subcribers: savedChannel.subcribers,
            createdAt: savedChannelChannel.createdAt,
            videos: [{
                title: userVideoList.title, 
                path: userVideoList.filePath, 
                createdAt: userVideoList.createdAt,
            }] 

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

        //ensure user is the owner of the channel
        if (!userId && !channelId) {
            return res.status(403).json({
                status: "FAILED",
                message: "User is unauthorized to perform this operation"
            });
        }

        const findChannelById = await Channel.findOneAndDelete({_id: channelId});
        if (!findChannelById) {
            return res.status(404).json({
                status:"FAILED",
                message: "Not Found: user has no such channel"
            });
        }

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
        if (!userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Unauthorized"
            });
        }

        const retrieveChannel = await Channel.findOneAndUpdate({_id: channelId});
        if (!retrieveChannel) {
            return res.status(404).json({
                status: "FAILED",
                message: "Not found: No existing channel"
            })
        }
        // prompt user to tell what actin in the channel
        const askUser = prompt('Do you want to update channel name?  ').toLowerCase;
        if (askUser === 'yes') {
            req.body.name = req.body;
        } else if (askUser === 'no') {
            req.body.description = request.body;
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "Your channel was updated successfully",
            name: req.body.name,
            description: req.body.description
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}