import express from "express";
import { 
    getAuthorize,
    getToken,
    postApprove, 
} from "./oauth2Controller.js";

const oauth2Route = express.Router();

oauth2Route.get('/authorize', getAuthorize);
oauth2Route.post('/approve', postApprove);
oauth2Route.get('/token', getToken);

export default oauth2Route;