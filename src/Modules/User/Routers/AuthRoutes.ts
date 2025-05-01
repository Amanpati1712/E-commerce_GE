import express from "express";
import { getAllData, userLogin, userRegister } from "../Controllers/AuthController";
import {upload} from '../../../Middleware/MulterMiddleware';
const router = express.Router();




// router.post('/userRegister', upload.single("profilePicture"), userRegister);
router.post('/userRegister', userRegister);
router.post('/userLogin', userLogin);

router.get('/getAllData', getAllData);

export { router };





















