const jwt = require("jsonwebtoken");
import dotenv from 'dotenv';

dotenv.config();



if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

// Generate JWT token
const generateToken = (id: number , role:string): string => {
  return jwt.sign({ id , role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export {generateToken}