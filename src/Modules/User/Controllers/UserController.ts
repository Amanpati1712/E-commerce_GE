import { Request, Response } from 'express';
import { AddProduct, createFeedback, createOffer } from '../Service/UserProduct';
import logger from '../../../Infra/Logger/Logger';


interface AuthenticatedRequest extends Request {
    user?: { id: number }; 
  }

export const Admin=(req:Request,res:Response)=>{
    res.json({message:"welcome Admin"})

}

export const Seller=async(req:Request,res:Response)=>{
    try {
        const { productName,product_Old_Price,product_New_Price,category,available } = req.body;
       
        const result = await AddProduct(productName,product_Old_Price,product_New_Price,category,available)
        res.status(201).json(result);
    } catch (error: any) {
        logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
    
}




export const addFeedback = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { productId, comment, rating } = req.body;
        const userId = req.user?.id;

        if (!userId) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
        }

        if (!productId || !comment || rating === undefined) {
         res.status(400).json({ message: "Missing required fields" });
        }

        const feedback = await createFeedback(userId, productId, comment, rating);
        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error: any) {
        logger.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Offer apply on product--->


export const addOffer=async(req:Request,res:Response)=>{
    try{

    const { productId,discountPercentage,startDate,endDate,description} = req.body;

    const newOffer = await createOffer( productId,discountPercentage,startDate,endDate,description);
    res.status(201).json({ message: "Offer created successfully", newOffer });
} catch (error:any) {
     res.status(400).json({ message: error.message });
}



}