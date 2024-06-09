import Video from "../models/videoModel.js";

export const getHistory = async (req, res) => {
    try{
        const userId = req.user._id;
        const watchedList = req.user.watchedVideos;
        if (!userId){
            return res.status(403).send('Unauthorized');
        }
        if(watchedList.length === 0 || watchedList === null){
            return res.status(200).send({
                message: 'No history'
            });
        }

        res.status(200).send({
            History: watchedList
        })
    } catch(error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}


export const getDownloads = async(req, res) => {
    try {
        const userId = req.user._id;
        const videoId = req.params.videoId;
        if(!userId){
            return res.status(403).send('Unauthorized');
        }
        if(!videoId){
            return res.status(400).send('No video ID given');
        }
        const video = await Video.findById(videoId);
        if (!video){
            return res.status(404).send('Video not found')
        }
        if(!video.viewsId.includes(userId)){
            video.viewsId.push(userId);
            video.views += 1;
            await video.save();
        }
        const videoURL = video.filePath;
        if(!videoURL){
            return res.status(404).send('Video URL not found')
        }
        res.redirect(302, videoURL);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}