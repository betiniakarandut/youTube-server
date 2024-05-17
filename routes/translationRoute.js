import express from 'express';
import { getTranslation } from '../controllers/languageController.js';

const translationRoute = express.Router();

translationRoute.get('/:lang', getTranslation);

export default translationRoute;