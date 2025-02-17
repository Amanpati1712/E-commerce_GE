import request from 'supertest';
import app from '../../../src/app';  // Import the actual Express app
import { AppDataSource } from '../../../src/Infra/DBconnect/Connect';
import { Repository } from 'typeorm';
import { userAuth,Product } from '../../../src/Modules/User/Entities/User';
import { Order } from '../../../src/Modules/Order/Entities/orderEntities';
const bcrypt=require("bcryptjs")

let orderRepo:Repository<Order> ;

let productRepo: Repository<Product>;
let userRepo: Repository<userAuth>; // ✅ Explicitly define the type
let token:string;


beforeAll(async () => {
  await AppDataSource.initialize();
  orderRepo = AppDataSource.getRepository(Order);
  userRepo = AppDataSource.getRepository(userAuth);
  productRepo = AppDataSource.getRepository(Product);
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('Auth API Endpoints', () => {
  describe('POST /api/auth/userRegister', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'pass11',
        role: 'Seller'
      };

      // ✅ Correct way to mock repository methods
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');
      jest.spyOn(userRepo, 'save').mockResolvedValue({} as any); // Simulate saving a user

      const res = await request(app).post('/api/auth/userRegister').send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
  });



describe('POST /api/auth/userLogin', () => {
    it('should log in an existing user', async () => {
        const user = {
          email: 'john@example.com',
          password: 'pass11'
        };
      
        const hashedPassword = await bcrypt.hash('pass11', 10); // ✅ Await outside object
        let mockUser:any = {
          id: 1,
          email: 'john@example.com',
          password: hashedPassword, // ✅ Store the hashed password
          role: 'Seller'
        };
      
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      
        const res = await request(app).post('/api/auth/userLogin').send(user);
      
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');

        token = res.body.token;
      });
      
  });


  describe('GET /api/auth/getAllData', () => {
    it('should return all users', async () => {
      const users:any = [{ id: 1, name: 'John Doe', email: 'john@example.com',role:"Seller" }];

      jest.spyOn(userRepo, 'find').mockResolvedValue(users);

      const res = await request(app).get('/api/auth/getAllData');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(users);
    });
  });

  describe('🔹 Product APIs', () => {
    it('Should add a new product (Seller role)', async () => {
      const product = {
        productName: 'Laptop',
        product_Old_Price: 1000,
        product_New_Price: 800,
        category: 'Electronics',
        available: true,
      };
  
      const res = await request(app).post('/api/user/Seller').set('Authorization', `Bearer ${token}`).send(product);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Product Add Successfully');
    });
  });
  
  //feedback
  describe(' Feedback APIs', () => {
    it('Should submit feedback (User role)', async () => {
      const feedback = {
        productId: 1,
        comment: 'Great product!',
        rating: 5,
      };
  
      const res = await request(app).post('/api/user/Feedback').set('Authorization', `Bearer ${token}`).send(feedback);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Feedback submitted successfully');
    });
  });

  // offer
  describe('🔹 Offer APIs', () => {
    it('Should create a product offer (Admin/Seller role)', async () => {
      const offer = {
        productId: 1,
        discountPercentage: 10,
        startDate: new Date(),
        endDate: new Date(),
        description: 'Limited-time discount!',
      };
  
      const res = await request(app).post('/api/user/Offer').set('Authorization', `Bearer ${token}`).send(offer);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Offer created successfully');
    });



});


//Order
describe('🔹 Order APIs', () => {
  it('Should create an order successfully', async () => {
    const user:any = {
      id: 1,
      email: 'john@example.com',
      password: await bcrypt.hash('pass11', 10),
      role: 'User',
    };

    const products:any = [
      { id: 1, productName: 'Laptop', product_New_Price: 800 },
      { id: 2, productName: 'Phone', product_New_Price: 500 },
    ];

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
    jest.spyOn(productRepo, 'findByIds').mockResolvedValue(products);
    jest.spyOn(orderRepo, 'save').mockResolvedValue({} as any);

    const res = await request(app)
      .post('/api/order')
      .set('Authorization', `Bearer ${token}`)
      .send({
        products: [1, 2],
        user,
        totalPrice: 1300,
        paymentMode: 'Credit Card',
        paymentStatus: 'Paid',
        shippingAddress: '123 Main St, NY',
        orderStatus: 'Processing',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Order created successfully');
    expect(res.body).toHaveProperty('order');
  });
});

});


