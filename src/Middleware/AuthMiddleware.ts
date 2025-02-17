import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: { id: number, role: string }; // Attach id and role to req.user
}

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    let token: string | undefined;
    const authHeader = req.headers.authorization || req.headers.Authorization;
  
    if (typeof authHeader === "string") {
      token = authHeader.split(" ")[1]; // Extract token from "Bearer token" format
    }
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" }); // Exit after response
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Decode the token
      req.user = decoded as { id: number, role: string }; // Attach decoded user to req.user
      console.log(req.user); // Debugging line to check user
      next();
    } catch (error) {
      return res.status(403).json({ message: "Forbidden: Invalid token" }); // Exit after response
    }
};

export { verifyToken };
