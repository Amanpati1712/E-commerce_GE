import { Request, Response } from 'express';
import logger from '../../../Infra/Logger/Logger';
import { placeOrder } from '../Service/orderService';


interface AuthenticatedRequest extends Request {
    user?: { id: number }; 
  }



// Here  i am creating order--------->

export const createOrder= async (req: AuthenticatedRequest, res: Response)=> {
    try {
        const { products, totalPrice, paymentMode, paymentStatus, shippingAddress, orderStatus,} = req.body;

        // The problem occurs because userId might be undefined, and when you pass it to placeOrder, TypeScript does not allow undefined where a number is expected.


        if (!req.user || !req.user.id) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return; 
        }
       
        const userId = req.user?.id; 

        if (!userId) {
           res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const order = await placeOrder(userId, products, totalPrice, paymentMode, paymentStatus, shippingAddress, orderStatus);
        
        res.status(201).json({ message: "Order created successfully", order });
    } catch (error: any) {
        logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
};

