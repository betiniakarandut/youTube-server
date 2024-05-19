import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from "./api_doc.js";
import { dbConnStr } from "./utils/configuration.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoute from "./routes/videoRoutes.js";
import commentRoute from "./routes/commentRoute.js";
import likeRoute from "./routes/likeRoute.js";
import channelRoute from "./routes/channelRoutes.js";
import viewsRoute from "./routes/viewsRoutes.js";
import searchRoute from "./routes/searchAndPlayBackRoute.js";
import dashboardRoute from "./routes/userDashboardRoute.js";
import translationRoute from "./routes/translationRoute.js";


const app = express();
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/video', videoRoute);
app.use('/comments', commentRoute);
app.use('/likes', likeRoute);
app.use('/channel', channelRoute);
app.use('/views', viewsRoute);
app.use('/search', searchRoute);
app.use('/dashboard', dashboardRoute);
app.use('/translation', translationRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    if (res.statusCode === 200) {
        return res.status(200).json({message: "Welcome to YouTube server"});
    }else{
        console.log("Server is not running");
    }
});

mongoose.connect(dbConnStr, { useNewUrlParser: true })
.then( () => {
    console.log("YouTube database is connected");

    app.listen(process.env.PORT, () => {
        console.log(`server is running on port 127.0.0.1:${process.env.PORT}`);
    })
}
).catch( (err) => {
    console.log(`YouTube Database is not connected:${err}`)
})

