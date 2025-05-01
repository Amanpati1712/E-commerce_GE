
import express from "express";
import { verifyToken } from "../../../Middleware/AuthMiddleware";
import { authorizerole } from "../../../Middleware/roleMiddleware";
import {  orderSuccess} from "../Controllers/OrderController";

const orderRouter = express.Router();

// // making order--->
// orderRouter.post("/order", verifyToken, authorizerole("Admin", "Seller", "User"), createOrder);
orderRouter.post("/orderSuccess",verifyToken,orderSuccess )
export {orderRouter}