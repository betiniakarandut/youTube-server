import Video from "../models/videoModel.js";

export const pagination = async (req, res) => {
    try {
        const rawPage = typeof req.query.page === 'string'? req.query.page: undefined;
        const page = rawPage? parseInt(rawPage): 1;
        const perPage = 9;

        const numberOfVideos = await Video.countDocuments();
        const videoPerPage = await Video.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

        return res.status(200).json({
            status: "SUCCESS",
            message: "display 9 videos per page",
            howManyVideos: numberOfVideos,
            videos: videoPerPage,
            page: page,
            perPage: perPage,

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}