import { AppDataSource } from "../../../Infra/DBconnect/Connect";
import { Feedback, Offer, Product, userAuth} from "../Entities/User";



const productRepo = AppDataSource.getRepository(Product);
const userRepo = AppDataSource.getRepository(userAuth);
const feedbackRepo=AppDataSource.getRepository(Feedback)
const offerRepo=AppDataSource.getRepository(Offer)

// Product Addition ---->

export const  AddProduct= async (productName:string,product_New_Price:number,product_Old_Price:number,category:string,available:boolean) => {
    if (!productName || !category || !product_New_Price) {
        throw new Error('Name, categories, and price are required');
    }


    const newProduct : Product = new Product();
    newProduct.productName=productName
    newProduct.product_New_Price=product_New_Price
    newProduct.product_Old_Price=product_Old_Price
    newProduct.category=category
    newProduct.available=available
    await productRepo.save(newProduct);
    return { message: 'Product Add Successfully' };


   
};




// feedback form

export const createFeedback = async (userId: number, productId: number, comment: string, rating: number) => {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const feedback = feedbackRepo.create({ user, product, comment, rating });
    await feedbackRepo.save(feedback);
    return {message:"feedback successfully",feedback};
};



//CreateOffer here---->

export const createOffer = async (
    
    productId: number,
    discountPercentage: number,
    startDate: Date,
    endDate: Date,
    description: string
) => {
    const product = await productRepo.findOne({ where: { id: productId } });
    // const product = await offerRepo.findOne({ where: { id: productId } }); // Correct way to find product by ID
    
    if (!product) throw new Error("Product not found");

    const newOffer = offerRepo.create({
        product,
        discountPercentage,
        startDate,
        endDate,
        description,
    });

    await offerRepo.save(newOffer);
    return {message:"feedback successfully",newOffer};
};
