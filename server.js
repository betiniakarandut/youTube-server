import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerSetup from "./swagger.js";
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
import paystackRoute from "./routes/paystackRoute.js";
import bitpayRoute from "./routes/bitpayRoute.js";
import oauth2Route from "./server-auth/oauth2Route.js";
import profileRoute from "./routes/profileRoute.js";
import adRoute from "./routes/adsRoute.js";

const app = express();
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

swaggerSetup(app);

app.use('/user', userRoutes);
app.use('/video', videoRoute);
app.use('/comments', commentRoute);
app.use('/likes', likeRoute);
app.use('/channel', channelRoute);
app.use('/views', viewsRoute);
app.use('/search', searchRoute);
app.use('/dashboard', dashboardRoute);
app.use('/translation', translationRoute);
app.use('/payments', paystackRoute);
app.use('/payments', bitpayRoute);
app.use('/auth', oauth2Route);
app.use('/profile', profileRoute);
app.use('/ad', adRoute);

app.get('/', (req, res) => {
    if (res.statusCode === 200) {
        return res.status(200).json({message: "Welcome to YouTube server\n"});
    }else{
        console.log("Server is not running");
    }
});

const port = process.env.PORT || 5000;
console.log(port);

mongoose.connect(dbConnStr, { useNewUrlParser: true })
.then( () => {
    console.log("YouTube database is connected");

    app.listen(port, '0.0.0.0', () => {
        console.log(`server is running on 0.0.0.0:${port}`);
    })
}
).catch( (err) => {
    console.log(`YouTube Database is not connected:${err}`)
})

