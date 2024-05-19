import path from 'path';

export const getTranslation = async (req, res) => {
    try {
        const lang = req.params.lang;
        // assume we are getting language from the client page language-location
        const filePath = path.join(__dirname, 'translation', `${lang.split('-')[0]}.json`);
        res.sendFile(filePath, 'utf-8', (error, data) => {
            if(error) {
                return res.status(404).json({
                    status: "FAILED",
                    message: "Translation not found"
                });
            }
            try {
                const data = JSON.parse(data);
                res.set("Cache-Control", "public, max-age=3600")
                return res.json(data);
            } catch (parseError) {
                res.send(parseError).json({
                    status: "FAILED",
                    message: "Error parsing translation"
                })
                
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Internal server error"
        });
    }
}