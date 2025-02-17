import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string }; // Explicitly define the `user` object
}

const authorizerole = (...allowRoles: string[]) => {
  console.log(allowRoles);  
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
      if (!req.user || !allowRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied: You do not have the required role" }); 
      }
      next(); // Proceed to the next middleware or route handler
    };
};

export { authorizerole };

