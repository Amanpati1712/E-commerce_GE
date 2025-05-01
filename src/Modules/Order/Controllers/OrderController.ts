import { Request, Response } from 'express';
import logger from '../../../Infra/Logger/Logger';
import {  orderSuccessService } from '../Service/orderService';



interface AuthenticatedRequest extends Request {
    user?: { id: number }; 
  }


// // proceed to pay ---->

export const orderSuccess=async(req: AuthenticatedRequest,res:Response)=>{
try {

    const {selectedItems}=req.body;

    if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return; 
    }
   
    const userId = req.user?.id; 

    console.log(userId,"userId")

    if (!userId) {
       res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const order =await orderSuccessService(userId,selectedItems)
    res.status(201).json({ message: "Order created successfully", order });

} catch (error:any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
    
}
}