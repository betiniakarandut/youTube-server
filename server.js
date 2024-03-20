import express from "express";
import mongoose from "mongoose";
import { dbConnStr, PORT } from "./utils/configuration.js";

const app = express();


app.get('/', (req, res) => {
    if (res.statusCode === 200) {
        res.send("Welcome to YouTube server");
    }else{
        console.log("Server is not running");
    }
    
})

mongoose.connect(dbConnStr, { useNewUrlParser: true, useUnifiedTopology: true }).then( () => {
    console.log("YouTube database is connected");

    app.listen(PORT, () => {
        console.log(`server is running on port 127.0.0.1:${PORT}`);
    })
}
).catch( (err) => {
    console.log(`YouTube Database is not connected:${err}`)
})
