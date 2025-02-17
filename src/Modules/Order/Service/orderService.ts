
import { AppDataSource } from "../../../Infra/DBconnect/Connect";
import { Product, userAuth } from "../../User/Entities/User";
import { Order } from "../Entities/orderEntities";

const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(userAuth);
const productRepo = AppDataSource.getRepository(Product);
// place order

export const placeOrder = async (
    userId: number,
    products: number[],
    totalPrice: number,
    paymentMode: string,
    paymentStatus: string,
    shippingAddress: string,
    orderStatus: string,
   
) => {
    try {
        // Validate User
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) throw new Error("User not found");

        // Validate Products
        const productList = await productRepo.findByIds(products);
        console.log(productList)
        if (productList.length !== products.length) {
            throw new Error("Some products not found");
        }

        // Create Order
        const newOrder = orderRepo.create({
            user,
            products: productList,
            totalPrice,
            paymentMode,
            paymentStatus,
            shippingAddress,
            orderStatus,
            
        });

        // Save Order
        await orderRepo.save(newOrder);

        return {message:"Order successfully",newOrder};
    } catch (err) {
        throw new Error("there is an error at the time of placing order--");
    }
};

