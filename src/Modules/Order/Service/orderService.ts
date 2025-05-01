
import { AppDataSource } from "../../../Infra/DBconnect/Connect";
import { Product, userAuth, AddToCart, Address  } from "../../User/Entities/User";
import { Order } from "../Entities/orderEntities";

const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(userAuth);
const productRepo = AppDataSource.getRepository(Product);
const cartRepo =AppDataSource.getRepository(AddToCart)
const addressRepo=AppDataSource.getRepository(Address)
// place order

// export const placeOrder = async (
//     userId: number,
//     products: number[],
//     totalPrice: number,
//     paymentMode: string,
//     paymentStatus: string,
//     shippingAddress: string,
//     orderStatus: string,
   
// ) => {
//     try {
//         // Validate User
//         const user = await userRepo.findOneBy({ id: userId });
//         if (!user) throw new Error("User not found");

//         // Validate Products
//         const productList = await productRepo.findByIds(products);
//         console.log(productList)
//         if (productList.length !== products.length) {
//             throw new Error("Some products not found");
//         }

//         // Create Order
//         const newOrder = orderRepo.create({
//             user,
//             totalPrice,
//             paymentMode,
//             paymentStatus,
//             shippingAddress,
//             orderStatus,
            
//         });

//         // Save Order
//         await orderRepo.save(newOrder);

//         return {message:"Order successfully",newOrder};
//     } catch (err) {
//         throw new Error("there is an error at the time of placing order--");
//     }
// };



// // proceed to pay--->
export const orderSuccessService=async(userId:number, selectedItems?: number[])=>{
try {
    const user = await userRepo.findOne({ where: { id: userId } });
    const addresses = await addressRepo.find({
        where: { user: { id: userId } },
        order: { isDefault: "DESC" }, // Default one appears first
      });

    console.log(user,"cartUser")
    if (!user) throw new Error("User not found");

    let cartItems = await cartRepo.find({ 
        where: { user: { id: userId } },
        relations: ["user", "product"]
    });

    if (cartItems.length === 0) throw new Error("Cart is empty");

    if (selectedItems && selectedItems.length > 0) {
        cartItems = cartItems.filter(item => selectedItems.includes(item.id));
      }

    let totalAmount = 0;
    const products: Product[] = [];

    
    // Check stock and calculate total price

    for (const cartItem of cartItems) {
        const product = cartItem.product;

        if (product.quantity < cartItem.quantity) {
            throw new Error(`Not enough stock for product: ${product.productName}`);
        }

        totalAmount += product.product_New_Price * cartItem.quantity;
        products.push(product);
    }

    // Create an order
    const order = orderRepo.create({
        user,
        products,
        totalPrice: totalAmount,
        paymentMode:"online",
        paymentStatus: "Done",
        shippingAddress:addresses[0].street,
        orderStatus: "PENDING",
    });

    await orderRepo.save(order);

    // Reduce stock for each product
    for (const cartItem of cartItems) {
        cartItem.product.quantity -= cartItem.quantity;
        await productRepo.save(cartItem.product);
    }

    // Clear user's cart after order is placed
    
    await cartRepo.delete({ user: { id: userId } });

    return { message: "Order placed successfully", order };


    
} catch (error) {
    throw new Error("there is an error at the time of placing order--");
}
}