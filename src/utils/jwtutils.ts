const jwt = require("jsonwebtoken");
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = "jwswiiuugoekjkajudou";

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

// Generate JWT token
const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
};

export {generateToken}