import { Request, Response } from 'express';
import { AddProduct, AddToCartService, createFeedback, createOffer, getProductService, getProfileService, GetCartDataService,RemoveFromCartService,calculateSummary,updateCartQuantityService,createAddressService, getAddressesService, getSearchProductService} from '../Service/UserProduct';
import logger from '../../../Infra/Logger/Logger';
import { uploadToGCP } from '../../../Middleware/MulterMiddleware';
import { instance } from '../../../app';
import orders from 'razorpay/dist/types/orders';
import crypto from 'crypto';
import { AppDataSource } from '../../../Infra/DBconnect/Connect';
import { Payment } from '../Entities/User';

interface AuthenticatedRequest extends Request {
    user?: { id: number }; 
  }

  interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const paymentRepo=AppDataSource.getRepository(Payment)




export const Admin=(req:Request,res:Response)=>{
    res.json({message:"welcome Admin"})

}

export const addProduct=async(req:MulterRequest,res:Response)=>{
    try {
        const { productName,product_Old_Price,product_New_Price,category,quantity,image} = req.body;

        let uploadedImageUrl = image; // Default to existing profile picture URL

        if (req.file) {
            uploadedImageUrl = await uploadToGCP(req.file); // Upload to GCP
        }
       
        const result = await AddProduct( productName,
            Number(product_Old_Price),
            Number(product_New_Price),
            category,
            Number(quantity),
            uploadedImageUrl)
        res.status(201).json(result);
    } catch (error: any) {
        logger.error(error.message);
        res.status(400).json({ message: error.message });
    }
    
}



// feedback------------>
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

//Add to cart-------------------->

export const addToCart=async(req: AuthenticatedRequest,res:Response)=>{
    try {
        const {  productId, quantity,size} = req.body;
        const userId = req.user?.id;

        if (!userId) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
        }
        const cart = await AddToCartService(userId, productId, quantity,size);
        res.status(201).json({message:"addToCart Successfully",cart});
    } catch (error:any) { 
         res.status(500).json({ message: error.message });
    }
}

// delete from cart-------------->

export const RemoveFromCartController = async (req: Request, res: Response) => {
    try {
        const cartItemId = parseInt(req.params.id);

        if (isNaN(cartItemId)) {
            res.status(400).json({ message: "Invalid cart item ID" })
            return;
        }

        const result = await RemoveFromCartService(cartItemId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// update cart quantity-------------->


export const updateCartQuantity = async (req: Request, res: Response) => {
  const { id, delta } = req.body;

  if (!id || typeof delta !== 'number') {
    res.status(400).json({ error: 'Invalid input' });
    return
  }

  try {
    const updatedCart = await updateCartQuantityService(id, delta);
    res.status(200).json(updatedCart);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// getCartData---->


export const getCartData = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
             res.status(401).json({ message: "Unauthorized: User not found" });
             return
        }

        const cartItems = await GetCartDataService(userId);

        res.status(200).json({ cartItems });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// Get Product based on seraching  ---->
export const getProduct = async (req: Request, res: Response) => {
    try {
        const { search, page } = req.query;
        const response = await getProductService(search as string, page as string);
        res.json(response);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getSearchProduct = async (req: Request, res: Response) => {
  try {
      const { search, page } = req.query;
      const response = await getSearchProductService(search as string, page as string);
      res.json(response);
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
};



// get profile data

export const getProfile=async(req: AuthenticatedRequest, res: Response)=>{
   

   try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    const profileData  = await getProfileService(userId) 
    res.json(profileData);
   } catch (error:any) {
    res.status(500).json({ message: error.message });
   }



}


// delete products

// export const deleteProduts=async(req: Request, res: Response)=>{
   
//     const del  = await deleteservice();
//     res.json({message:"delete all data"})
// }

// get summary of order------------>

// ... other imports

export const getSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }
    const { selectedItems } = req.body;
   
    const summary = await calculateSummary(userId, selectedItems);
    res.json(summary);
  } catch (error) {
    logger.error("Error in getSummary:", error);
    res.status(500).json({ message: "Failed to calculate summary" });
  }
};



// Create adress--------------->

export const createAddress = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId){
        res.status(401).json({ message: "Unauthorized" });
        return 
      } 
  
      const address = await createAddressService(userId, req.body);
      res.status(201).json({ message: "Address added successfully", address });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

// get adresss----------->
export const getAddresses = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
  
      const addresses = await getAddressesService(userId);
      res.status(200).json({ addresses });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };




// checkout-->

export const checkout = async (req: Request, res: Response) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),  // 50000 paise = ₹500
      currency: "INR",
      receipt: "receipt_order_74394"
    };

    const order = await instance.orders.create(options);
    console.log(order)
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};


// 
export const paymentVerification = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const secret = process.env.RAZORPAY_API_SECRET || 'your_secret_key';

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
     res.status(400).json({ success: false, message: "Invalid signature" });
     return
  }

  // Save payment to DB
  await paymentRepo.save(
    paymentRepo.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
  );

  // Place order using service
  try {  
   res.status(200).json({success:true})
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, message: "Payment verified, but order placement failed" });
  }
};


// get keys--------->
export const getKeys=async(req: Request, res: Response)=>{
res.status(200).json({key:process.env.RAZORPAY_API_KEY})
}