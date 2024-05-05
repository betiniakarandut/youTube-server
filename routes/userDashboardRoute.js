import express from "express";
import { middlewareAuth } from "../middlewares/userAuth.js";
import multer from "multer";
import { userDashboard } from "../controllers/userDashboard.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage});

const dashboardRoute = express.Router();

dashboardRoute.post('/', upload.single('file'), middlewareAuth, userDashboard);

export default dashboardRoute;