import { Request, Response } from 'express';
import logger from '../../../Infra/Logger/Logger';
import { getAllUsers, loginUser, registerUser } from '../Service/UserAuth';
import { uploadToGCP } from '../../../Middleware/MulterMiddleware';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
const port=process.env.PORT || 3000;

export const getAllData = async (req: Request, res: Response) => {
    try {
        const allData = await getAllUsers();
        res.json(allData);
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const userRegister = async (req:MulterRequest, res: Response) => {
    try {
        console.log("Request received:", req.body); // Debug request body
        console.log("File received:", req.file); // Debug uploaded file
        const { name, email, password, role, profilePicture } = req.body;
       
        let uploadedImageUrl = profilePicture; // Default to existing profile picture URL

        if (req.file) {
            uploadedImageUrl = await uploadToGCP(req.file); // Upload to GCP
        }
        const result = await registerUser(name, email, password,role ,uploadedImageUrl);
        res.status(201).json(result);
    } catch (error: any) {
        logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        logger.error(error.message);
        res.status(401).json({ message: error.message });
    }
};




































// export async function getData(req: Request, res: Response) {
//     //Getting A User repo from APpDAtasource
// // 
// // // Find all the records from database..

// // const allRecords =await userRepo.find();

// // create a user inside database--->

// // let user:User = new User();
   
// // user.firstName="aman"
// // user.lastName="patidar"
// // user.age=22

// // const userInserted = await userRepo.save(user);


// // const user = userRepo.create({
// //     firstName: "Aman",
// //     lastName: "Patidar",
// //     age: 23,
// //   });
  
// // const userInserted=  await userRepo.save(user);

// // for delete data------------------->
// // await userRepo.delete(2);

// // for update inside database
// // await userRepo.update(3,{firstName:"lala" ,lastName:"kamdar"})
// // const allRecords =await userRepo.find();
// // logger.error(allRecords)
// res.json();
// }

