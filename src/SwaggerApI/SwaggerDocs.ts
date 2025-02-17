/**
 * @swagger
 * components:
 *   schemas:
 *     UserAuth:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123"
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           example: "http://localhost:3000/images/profile.jpg"
 *         role:
 *           type: string
 *           example: "customer"
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         productName:
 *           type: string
 *           example: "Wireless Headphones"
 *         product_Old_Price:
 *           type: number
 *           example: 150.00
 *         product_New_Price:
 *           type: number
 *           example: 120.00
 *         category:
 *           type: string
 *           example: "Electronics"
 *         available:
 *           type: boolean
 *           example: true
 *
 *     Feedback:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user:
 *           $ref: "#/components/schemas/UserAuth"
 *         product:
 *           $ref: "#/components/schemas/Product"
 *         comment:
 *           type: string
 *           example: "Great product, highly recommend!"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-02-15T12:00:00Z"
 *
 *     Offer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         product:
 *           $ref: "#/components/schemas/Product"
 *         discountPercentage:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           example: 20
 *         description:
 *           type: string
 *           example: "Limited-time 20% discount on all headphones."
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2024-02-10T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2024-03-10T23:59:59Z"
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user:
 *           $ref: "#/components/schemas/UserAuth"
 *         products:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Product"
 *         totalPrice:
 *           type: number
 *           example: 299.99
 *         paymentMode:
 *           type: string
 *           example: "Credit Card"
 *         paymentStatus:
 *           type: string
 *           example: "Paid"
 *         shippingAddress:
 *           type: string
 *           example: "123 Main St, City, Country"
 *         orderStatus:
 *           type: string
 *           example: "Processing"
 *         orderDate:
 *           type: string
 *           format: date-time
 *           example: "2024-02-15T14:30:00Z"
 */


/**
 * @swagger
 * /api/auth/userRegister:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with name, email, password, role, and profile picture.
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - userRegister
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 example: "customer"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     profilePicture:
 *                       type: string
 *                       example: "http://localhost:3000/images/profile.jpg"
 *       400:
 *         description: Bad request, validation error
 */


/**
 * @swagger
 * /api/auth/userLogin:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password.
 *     tags:
 *       - UserLogin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
 *       401:
 *         description: Unauthorized, invalid credentials
 */




/**
 * @swagger
 * /api/auth/getAllData:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetch a list of all registered users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal Server Error
 */




/**
 * @swagger
 * /api/user/Admin:
 *   get:
 *     summary: Admin Access
 *     description: Accessible only by Admin.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome Admin
 *         content:
 *           application/json:
 *             example:
 *               message: "Welcome Admin"
 */



/**
 * @swagger
 * /api/user/Seller:
 *   post:
 *     summary: Seller Access
 *     description: Accessible by Admin and Seller to add a product.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Seller-Addproduct
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               product_Old_Price:
 *                 type: number
 *               product_New_Price:
 *                 type: number
 *               category:
 *                 type: string
 *               available:
 *                 type: boolean
 *             required:
 *               - productName
 *               - product_Old_Price
 *               - product_New_Price
 *               - category
 *               - available
 */

/**
 * @swagger
 * /api/user/order:
 *   post:
 *     summary: Create an Order
 *     description: Users can create an order (Admin, Seller, or User).
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: number
 *               totalPrice:
 *                 type: number
 *               paymentMode:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *               orderStatus:
 *                 type: string
 *             required:
 *               - products
 *               - totalPrice
 *               - paymentMode
 *               - paymentStatus
 *               - shippingAddress
 *               - orderStatus
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 */


/**
 * @swagger
 * /api/user/Feedback:
 *   post:
 *     summary: Submit Feedback
 *     description: Users can submit feedback for a product (Admin, Seller, or User).
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: ID of the product being reviewed
 *               comment:
 *                 type: string
 *                 description: User's feedback comment
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *             required:
 *               - productId
 *               - comment
 *               - rating
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feedback submitted successfully
 *       400:
 *         description: Bad request, missing or invalid parameters
 */


// For-feedback



//for offeronProduct---->

/**
 * @swagger
 * /api/user/Offer:
 *   post:
 *     summary: Create an Offer
 *     description: Admins and Sellers can create a new offer for a product.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: ID of the product associated with the offer
 *               discountPercentage:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *                 description: Discount percentage for the offer
 *               description:
 *                 type: string
 *                 description: Description of the offer
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Offer start date
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Offer end date
 *             required:
 *               - productId
 *               - discountPercentage
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offer created successfully
 *       400:
 *         description: Bad request, missing or invalid parameters
 */
















