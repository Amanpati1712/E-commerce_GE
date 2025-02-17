const  bcrypt =require('bcryptjs');
import { AppDataSource } from '../../../Infra/DBconnect/Connect';
import { generateToken } from '../../../Infra/utils/jwtutils';
import { userAuth} from '../Entities/User';


const userRepo = AppDataSource.getRepository(userAuth);

export const getAllUsers = async () => {
    return await userRepo.find();
};

export const registerUser = async (name: string, email: string, password: string,role:string , newprofilePicture?:string) => {
    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
    }

    const existingUser = await userRepo.findOne({ where: { email: email } });

    if (existingUser) {
        throw new Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser : userAuth = new userAuth();
    newUser.name = name;
    newUser.email = email;
    newUser.role = role;
    newUser.profilePicture = newprofilePicture;
    newUser.password = hashedPassword;
    await userRepo.save(newUser);
    return { message: 'User registered successfully' };
};

export const loginUser = async (email: string, password: string) => {
    const users = await userRepo.findOne({ where: {email: email } });
    if (!users) {
        throw new Error('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, users.password);
    if (!isPasswordCorrect) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(users.id,users.role);

    return { message: 'Login successful', token };
};
