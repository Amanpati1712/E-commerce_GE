import express from "express";
import { addFeedback, addOffer, addProduct, addToCart, Admin,getProduct,  getProfile, getCartData, RemoveFromCartController,updateCartQuantity, getSummary, getAddresses, createAddress,  checkout, getKeys, paymentVerification, getSearchProduct} from "../Controllers/UserController";
import { verifyToken } from "../../../Middleware/AuthMiddleware";
import { authorizerole } from "../../../Middleware/roleMiddleware";
import { upload } from "../../../Middleware/MulterMiddleware";
const UserRouter = express.Router();

UserRouter.get("/Admin", verifyToken, authorizerole("Admin"), Admin);

UserRouter.post("/AddProduct",upload.single("image"),  addProduct);

UserRouter.post("/Feedback",verifyToken,authorizerole("Admin", "Seller", "User"),addFeedback)

UserRouter.post("/Offer", verifyToken, authorizerole("Admin", "Seller"), addOffer);

UserRouter.post("/cart/add", verifyToken,authorizerole("Admin", "Seller", "User"),addToCart);

UserRouter.get("/getCartData",verifyToken,getCartData)

UserRouter.delete("/cart/remove/:id",verifyToken, RemoveFromCartController);

UserRouter.post('/cart/update', updateCartQuantity);

UserRouter.get("/getProfileData",verifyToken, getProfile)

UserRouter.get("/getProducts",getProduct )
UserRouter.get("/getSearchProducts",getSearchProduct)

// UserRouter.delete("/deleteProducts",deleteProduts)

// getSummary-------->
UserRouter.post("/order/summary",verifyToken, getSummary);

//  create address and get address
UserRouter.post("/address",verifyToken, createAddress)
UserRouter.get("/address",verifyToken,getAddresses)




// CHECKOUT--->
UserRouter.post("/checkout",checkout)

UserRouter.post("/paymentVerification",paymentVerification)

UserRouter.get('/getKey', getKeys)
export { UserRouter };
