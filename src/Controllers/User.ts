
import { Request, Response } from 'express';  // Import Express types
import logger from '../Logger/Logger';
import { User, userAuth } from '../Entities/User';
import { AppDataSource } from '../DBconnect/Connect';
import "reflect-metadata";
import { generateToken } from '../utils/jwtutils';

const bcrypt= require("bcryptjs")



const userRepo = AppDataSource.getRepository(userAuth);

export async function getAllData(req:Request, res:Response) {
   const allData=  await userRepo.find();
   res.json(allData);
     
}
// register user
export async function userRegister(req:Request, res:Response) {
    
    const { name, email, password } = req.body;
    console.log(name,email,password)
    
    if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email, and password are required' });
        return;
      }

      const existingUser = await userRepo.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Email is already in use' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser:userAuth = new userAuth();
      newUser.name = name;
      newUser.email = email;
      newUser.password = hashedPassword;
    
      await userRepo.save(newUser);
    
      res.status(201).json({ message: 'User registered successfully' });


}


export const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log(email,password);
  
    const user = await userRepo.findOne({ where: { email } });
    console.log(user)
  
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
  
    // Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  
    const token = generateToken(user.id);
  
    res.status(200).json({ message: 'Login successful',token });
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

