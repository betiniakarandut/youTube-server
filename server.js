import express from "express";
import mongoose from "mongoose";
import { dbConnStr, PORT } from "./utils/configuration.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    if (res.statusCode === 200) {
        res.send("Welcome to YouTube server");
    }else{
        console.log("Server is not running");
    }S
    
})

mongoose.connect(dbConnStr, { useNewUrlParser: true })
.then( () => {
    console.log("YouTube database is connected");

    app.listen(PORT, () => {
        console.log(`server is running on port 127.0.0.1:${PORT}`);
    })
}
).catch( (err) => {
    console.log(`YouTube Database is not connected:${err}`)
})

