import express from "express";
import { addFeedback, addOffer, Admin,  Seller } from "../Controllers/UserController";
import { verifyToken } from "../../../Middleware/AuthMiddleware";
import { authorizerole } from "../../../Middleware/roleMiddleware";
const UserRouter = express.Router();


UserRouter.get("/Admin", verifyToken, authorizerole("Admin"), Admin);

UserRouter.post("/Seller", verifyToken, authorizerole("Admin", "Seller"), Seller);

UserRouter.post("/Feedback",verifyToken,authorizerole("Admin", "Seller", "User"),addFeedback)

UserRouter.post("/Offer", verifyToken, authorizerole("Admin", "Seller"), addOffer);

export { UserRouter };
