import express from "express";
import { 
    codeTokenExchange, 
    getAuthorized, 
    isApproved 
} from "./oauth2Controller.js";
import { middlewareAuth } from "../middlewares/userAuth.js";

const oauth2Route = express.Router();

oauth2Route.get('/authorize', middlewareAuth, getAuthorized);
oauth2Route.post('/approve', middlewareAuth, isApproved);
oauth2Route.get('/token', middlewareAuth, codeTokenExchange);

export default oauth2Route;