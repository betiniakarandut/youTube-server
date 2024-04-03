import express from "express";
import { views } from "../controllers/viewsController.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const viewsRoute = express.Router();

viewsRoute.get('/:videoId', middlewareAuth, views);

export default viewsRoute;