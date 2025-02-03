import express from "express";
import { getAllData, userLogin, userRegister } from "../Controllers/User";
// import { getData } from "../Controllers/User";
const router = express.Router();


// /**
//  * @swagger
//  * /users/getData:
//  *   get:
//  *     summary: Get sample data
//  *     description: Returns a simple message as a response.
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved the data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: string
//  *               example: "got data"
//  *       500:
//  *         description: Internal server error
//  */

router.post('/userRegister', userRegister);
router.post('/userLogin',userLogin);
router.get('/getAllData',getAllData)
export { router };

// /**
//  * @swagger
//  * /users/getData:
//  *   get:
//  *     summary: Get sample data
//  *     description: Returns a simple message as a response. Optionally initializes the data based on the 'init' query parameter.
//  *     parameters:
//  *       - in: query
//  *         name: init
//  *         description: Flag to initialize data. If set to 'true', data will be initialized.
//  *         required: false
//  *         schema:
//  *           type: string
//  *           example: "true"
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved the data ---
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: string
//  *               example: "retrive data"
//  *       500:
//  *         description: Internal server error ---
//  */
// router.get('/getData', (req, res) => {
//     const { init } = req.query;  // Access the 'init' query parameter

//     console.log('Received init query parameter:', init); // Optional debugging line to check query

//     // Check if 'init' is passed and its value is 'true'
//     if (init === 'true') {
//         // Initialize some data if 'init' is 'true'
//         res.json({ message: "Data initialized and got data" });
//     } else {
//         // Default behavior if 'init' is not 'true'
//         res.json({ message: "Data not initialized, no data fetched" });
//     }
// });

// export { router };