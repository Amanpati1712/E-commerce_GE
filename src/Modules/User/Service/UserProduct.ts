import { AppDataSource } from "../../../Infra/DBconnect/Connect";
import { Order } from "../../Order/Entities/orderEntities";
import { Address, AddToCart, Feedback, Offer, Product, userAuth} from "../Entities/User";
import { ILike, In } from "typeorm";

const productRepo = AppDataSource.getRepository(Product);
const userRepo = AppDataSource.getRepository(userAuth);
const feedbackRepo=AppDataSource.getRepository(Feedback)
const offerRepo=AppDataSource.getRepository(Offer)
const cartRepo =AppDataSource.getRepository(AddToCart)
const orderRepo= AppDataSource.getRepository(Order)
const addressRepo=AppDataSource.getRepository(Address)
// Product Addition ---->

export const  AddProduct= async (productName:string,product_New_Price:number,product_Old_Price:number,category:string,quantity:number,uploadedImageUrl:string) => {
    if (!productName || !category || !product_New_Price) {
        throw new Error('Name, categories, and price are required');
    }


    const newProduct : Product = new Product();
    newProduct.productName=productName
    newProduct.product_New_Price=product_New_Price
    newProduct.product_Old_Price=product_Old_Price
    newProduct.category=category
    newProduct.quantity=quantity
    newProduct.imageUrl=uploadedImageUrl
    await productRepo.save(newProduct);
    return {success: "true", message: 'Product Add Successfully',newProduct };

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


//add to cart 

export const AddToCartService = async (
    userId: number,
    productId: number,
    quantity: number,
    size:string
) => {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    let cartItem = await cartRepo.findOne({
        where: {
            product: { id: productId },
            user: { id: userId }
        },
        relations: ["user", "product"]
    });

    const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
    const totalRequested = currentQuantityInCart + quantity;

    // Check if the product has enough stock
    if (totalRequested > product.quantity) {
        throw new Error(
            `Only ${product.quantity - currentQuantityInCart} item(s) available in stock`
        );
    }

    if (cartItem) {
        cartItem.quantity = totalRequested;
    } else {
        cartItem = cartRepo.create({ user, product, quantity ,size });
    }

    await cartRepo.save(cartItem);
    return cartItem;
};
// delete from cart-------->
export const RemoveFromCartService = async (cartItemId: number) => {
    const cartItem = await cartRepo.findOne({ where: { id: cartItemId } });

    if (!cartItem) {
        throw new Error("Cart item not found");
    }

    await cartRepo.remove(cartItem);

    return { message: "Item removed from cart successfully" };
};

// update cart   quantity-------------->
export const updateCartQuantityService = async (id: string, delta: number) => {
    const cartItem = await cartRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['product', 'user']
    });
  
    if (!cartItem) throw new Error('Cart item not found');
  
    const newQuantity = cartItem.quantity + delta;
  
    if (newQuantity < 1) {
      await cartRepo.remove(cartItem);
    } else {
      if (newQuantity > cartItem.product.quantity) {
        throw new Error(`Only ${cartItem.product.quantity} items available in stock.`);
      }
  
      cartItem.quantity = newQuantity;
      await cartRepo.save(cartItem);
    }
  
    const updatedCart = await cartRepo.find({
      where: { user: { id: cartItem.user.id } },
      relations: ['product']
    });
  
    return updatedCart;
  };

// getCartItems---->
export const GetCartDataService = async (userId: number) => {
    const cartItems = await cartRepo.find({
        where: { user: { id: userId } },
        relations: ["product"]
    });

    return cartItems;
};



// get Product Service----->

export const getProductService = async (search?: string, page?: string) => {
    const limit = 12;
    const currentPage = page ? parseInt(page) || 1 : 1;
    const skip = (currentPage - 1) * limit;

    
        // If search is not provided or empty, set whereCondition to undefined
        const whereCondition = search && search !== "undefined" ? { category: ILike(`%${search}%`) } : undefined;

    let products = await productRepo.find({
        where: whereCondition, 
        take: limit,
        skip: skip,
    });
    
    let fullProduct=await productRepo.find({
        where: whereCondition, 
    })

    let totalProducts = await productRepo.count({
        where: whereCondition,
    });


        // If no products found, fetch all products instead
        if (products.length === 0) {
            products = await productRepo.find({
                take: limit,
                skip: skip,
            });
    
            totalProducts = await productRepo.count();
        }
    return {
        products,
        fullProduct,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage,
    };

};


export const getSearchProductService = async (search?: string, page?: string) => {
    const limit = 12;
    const currentPage = page ? parseInt(page) || 1 : 1;
    const skip = (currentPage - 1) * limit;

    
        // If search is not provided or empty, set whereCondition to undefined
        const whereCondition = search && search !== "undefined" ? { productName: ILike(`%${search}%`) } : undefined;

    let products = await productRepo.find({
        where: whereCondition, 
        take: limit,
        skip: skip,
    });
    
    let fullProduct=await productRepo.find({
        where: whereCondition, 
    })

    let totalProducts = await productRepo.count({
        where: whereCondition,
    });


        // If no products found, fetch all products instead
        if (products.length === 0) {
            products = await productRepo.find({
                take: limit,
                skip: skip,
            });
    
            totalProducts = await productRepo.count();
        }
    return {
        products,
        fullProduct,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage,
    };

};






export const getProfileService = async (userId: number) => {
    const userprofile = await userRepo.findOne({ where: { id: userId } });
    return userprofile;
};


//  deleteproducts--->

// export const deleteservice=async()=>{
// //     const cart=await cartRepo.delete({})
// //     const offer = await offerRepo.delete({})
// //     const order= await  orderRepo.delete({})
// //     const user= await  userRepo.delete({})
  
// //    const deletefeed= await feedbackRepo.delete({ });
//    const deleteprod = await productRepo.delete({ id: In([53,54,56,57,58,59,60,61,62,63,64,65]) });

    

//   return deleteprod;
// }



export const calculateSummary = async (userId: number, selectedItems?: number[]) => {
  
  // Fetch full cart for the user
  let cartItems = await cartRepo.find({
    where: { user: { id: userId } },
    relations: ["product"],
  });

 
  // Filter based on selectedItems if provided
  if (selectedItems && selectedItems.length > 0) {
    cartItems = cartItems.filter(item => selectedItems.includes(item.id));

  }
  
  // Calculate summary based only on the filtered cartItems
  const items = cartItems.reduce(
    (sum, item) => sum + item.product.product_New_Price * item.quantity,
    0
  );
  const delivery = items > 500 ? 0 : items > 0 ? 50 : 0;
  const discount = 0;
  const total = items + delivery - discount;

  return { items, delivery, discount, total, cartItems };
  };


//   create address and get adress
export const createAddressService = async (userId: number, addressData: any) => {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
  
    if (addressData.isDefault) {
      await addressRepo.update({ user }, { isDefault: false });
    }
  
    const address = addressRepo.create({ ...addressData, user });
    await addressRepo.save(address);
    return address;
  };
  
  export const getAddressesService = async (userId: number) => {
    const addresses = await addressRepo.find({
      where: { user: { id: userId } },
      order: { isDefault: "DESC" }, // Default one appears first
    });
    return addresses;
  };